import { TRUE_BYTES, networkConfig } from "@/constants/contractConstants";
import { createContentMetadata } from "@/constants/lensConstants";
import ReactMarkdown from "react-markdown";
import { useLensContext } from "@/context/LensContext";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { encode } from "js-base64";
import toast, { Toaster } from "react-hot-toast";

import lensABI from "../lensABI.json";

const BASE_64_PREFIX = "data:application/json;base64,";
const PINATA_PIN_ENDPOINT = "https://api.pinata.cloud/pinning/pinJSONToIPFS";

async function pinMetadataToPinata(
  metadata,
  contentName,
  pinataApiKey,
  pinataApiSecret
) {
  console.log("Pinning metadata to Pinata...");
  const data = JSON.stringify({
    pinataContent: metadata,
    pinataMetadata: {
      name: contentName,
    },
  });

  const config = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      pinata_api_key: pinataApiKey,
      pinata_secret_api_key: pinataApiSecret,
    },
    body: data,
  };

  const response = await fetch(PINATA_PIN_ENDPOINT, config);
  const ipfsHash = (await response.json()).IpfsHash;
  console.log(`Pinned metadata to Pinata with hash: ${ipfsHash}`);
  return ipfsHash;
}
// POST FORM COMPONENT
function PostForm({ preview }) {
  const { profileId, token } = useLensContext();
  const { account, chainId } = useMoralis();
  const { register, handleSubmit, watch, errors, formState, reset } = useForm({
    mode: "onChange",
  });

  const chainIdString = chainId ? parseInt(chainId).toString() : "31337";

  const { runContractFunction } = useWeb3Contract();

  async function handlePostSuccess(tx) {
    const response = await tx.wait();
    toast.success("Successfully posted!");
  }

  const { isValid, isDirty } = formState;

  const publishPost = async function ({
    content,
    contentName,
    imageURI,
    imageType,
    pinataApiKey,
    pinataApiSecret,
  }) {
    console.log("Publishing post...");
    const contentMetadata = createContentMetadata(
      content,
      contentName,
      imageURI,
      imageType
    );

    // CONTENT URI
    const metadataIpfsHash = await pinMetadataToPinata(
      contentMetadata,
      contentName,
      pinataApiKey,
      pinataApiSecret
    );
    const fullContentURI = `ipfs://${metadataIpfsHash}`;
    console.log(`Full content URI: ${fullContentURI}`);

    // post to the blockchain
    const txParams = [
      profileId,
      fullContentURI,
      networkConfig[chainIdString].freeCollectModule, // CollectModule
      TRUE_BYTES,
      networkConfig[chainIdString].followerOnlyReferenceModule, // FollowerOnlyReferenceModule
      TRUE_BYTES,
    ];
    console.log(`txParams: ${txParams}`);

    const txOptions = {
      abi: lensABI,
      contractAddress: networkConfig[chainIdString].lensHubProxy, // LensHub Proxy
      functionName: "post",
      params: {
        vars: txParams,
      },
    };

    await runContractFunction({
      onSuccess: (tx) => handlePostSuccess(tx),
      onError: (error) => {
        toast.error("Error publishing post");
        console.log(error);
      },
      params: txOptions,
    });
    return null;
  };

  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset({ something: "" });
    }
  }, [formState, reset]);

  return (
    <form className="p-10" onSubmit={handleSubmit(publishPost)}>
      {preview && (
        <div className="markdown">
          <ReactMarkdown>{watch("content")}</ReactMarkdown>
        </div>
      )}
      <div className={preview ? "invisible" : "flex flex-col w-full "}>
        <input
          className="mb-2 border border-gray-300 "
          placeholder="Post Title"
          name="contentName"
          {...register("contentName", {
            maxLength: 100,
            required: true,
            minLength: 1,
          })}
        />
        <textarea
          className="h-96 mb-2 "
          placeholder="Write your article in markdown here!"
          name="content"
          {...register("content", {
            required: true,
            minLength: 10,
            maxLength: 25000,
          })}
        />
        <input
          className="mb-2 border border-gray-300 "
          placeholder="(optional) Image URI"
          name="imageURI"
          {...register("imageURI", {
            maxLength: 100,
            minLength: 1,
            required: false,
          })}
        />
        <input
          className="mb-2 border border-gray-300 "
          placeholder="(optional) image/svg+xml,image/gif,image/jpeg,image/png,image/tiff..."
          name="imageType"
          {...register("imageType", {
            maxLength: 100,
            minLength: 1,
            required: false,
          })}
        />
        <input
          className="mb-2 border border-gray-300 "
          placeholder="(optional) Pinata API Key"
          name="pinataApiKey"
          {...register("pinataApiKey", {
            maxLength: 100,
            minLength: 1,
            required: false,
          })}
        />
        <input
          className="mb-2 border border-gray-300 "
          placeholder="(optional) Pinata API Secret"
          name="pinataApiSecret"
          {...register("pinataApiSecret", {
            maxLength: 100,
            minLength: 1,
            required: false,
          })}
        />
      </div>
      {errors ? (
        <p className="text-danger">{errors.content?.message}</p>
      ) : (
        <div></div>
      )}
      {profileId && token ? (
        <button
          type="submit"
          className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
          disabled={!isDirty || !isValid}
        >
          Publish
        </button>
      ) : (
        <div>
          You need a lens profile to submit!{" "}
          <a
            href="https://claim.lens.xyz/"
            className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
          >
            Claim here!
          </a>
          <br />
          (Or you need to sign in)
        </div>
      )}
    </form>
  );
}

export default function WritePost() {
  const [preview, setPreview] = useState(false);

  return (
    <main className="flex flex-row w-full">
      <Toaster position="top-center" reverseOrder={false} />
      <section className="flex flex-col w-3/4 h-60">
        <h1 className="mt-40 text-center text-xl font-black">
          Write Your Post Here!
        </h1>
        <PostForm preview={preview} />
      </section>

      <aside className="flex flex-col w-1/4 mt-28 p-6">
        <h3 className="text-xl font-bold text-center">Tools</h3>
        <button
          className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
          onClick={() => setPreview(!preview)}
        >
          {preview ? "Edit" : "Preview"}
        </button>
      </aside>
    </main>
  );
}
