import { useLensContext } from "@/context/LensContext";
import { useForm } from "react-hook-form";

function PostForm() {
  const { profileId, token } = useLensContext();
  const { register, handleSubmit, watch, errors } = useForm({
    mode: "onChange",
  });

  const publishPost = async function () {
    console.log("Publishing post...");
    return null;
  };

  return (
    <form publishPost={handleSubmit}>
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
