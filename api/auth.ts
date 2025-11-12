import UserInfo from "@/types/UserInfo";
import instance from ".";

const login = async (userInfo: UserInfo) => {
  try {
    const { data } = await instance.post(
      "/mini-project/api/auth/login",
      userInfo
    );
    return data;
  } catch (error: any) {
    console.log("Login API error:", error);
    console.log("Error response data:", error?.response?.data);
    throw error;
  }
};

const register = async (userInfo: UserInfo, image: string, name: string) => {
  try {
    const formData = new FormData();

    formData.append("username", userInfo.username);
    formData.append("password", userInfo.password);
    formData.append("name", name || userInfo.username); // Use username as fallback if name is empty

    // Only append image if it exists and is not empty
    if (image && image.trim() !== "") {
      formData.append("image", {
        name: "image",
        uri: image,
        type: "image/jpeg",
      } as any);
    }

    const { data } = await instance.post(
      "/mini-project/api/auth/register",
      formData
    );
    return data;
  } catch (error: any) {
    console.log("Registration API error:", error);
    console.log("Error response data:", error?.response?.data);
    throw error;
  }
};

const me = async () => {
  const { data } = await instance.get("/mini-project/api/auth/me");
  return data;
};

const getAllUsers = async () => {
  const { data } = await instance.get("/mini-project/api/auth/users");
  return data;
};

export { login, register, me, getAllUsers };
