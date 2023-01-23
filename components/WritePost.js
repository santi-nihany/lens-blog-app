import { TRUE_BYTES } from "@/constants/contractConstants";
import { createContentMetadata } from "@/constants/lensConstants";
import { useLensContext } from "@/context/LensContext";
import { useForm } from "react-hook-form";
import { useWeb3Contract } from "react-moralis";
import lensABI from "../lensABI.json";

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

function PostForm() {
  const { profileId, token } = useLensContext();
  const { runContractFunction } = useWeb3Contract();
  const { register, handleSubmit, watch, errors } = useForm({
    mode: "onChange",
  });

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
      "0x23b9467334bEb345aAa6fd1545538F3d54436e96", // CollectModule
      TRUE_BYTES,
      "0x17317F96f0C7a845FFe78c60B10aB15789b57Aaa", // FollowerOnlyReferenceModule
      TRUE_BYTES,
    ];
    console.log(`txParams: ${txParams}`);

    const txOptions = {
      abi: lensABI,
      contractAddress: "0xdb46d1dc155634fbc732f92e853b10b288ad5a1d", // LensHub Proxy
      functionName: "post",
      params: {
        vars: txParams,
      },
    };

    await runContractFunction({ params: txOptions });
    return null;
  };

  return (
    <form onSubmit={handleSubmit(publishPost)}>
      <input
        placeholder="Post Title"
        name="contentName"
        {...register("contentName", {
          maxLength: 100,
          required: true,
          minLength: 1,
        })}
      />
      <textarea
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
      {errors ? (
        <p className="text-danger">{errors.content?.message}</p>
      ) : (
        <div></div>
      )}
      {profileId && token ? (
        <button type="submit">Publish!</button>
      ) : (
        <div>You need to sign in or a lens handle!</div>
      )}
    </form>
  );
}

export default function WritePost(props) {
  return (
    <div>
      <PostForm />
    </div>
  );
}
