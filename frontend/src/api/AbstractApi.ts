import axios, { AxiosInstance } from "axios";

export default abstract class BaseApi {
  client: AxiosInstance;

  constructor(userToken: string | null) {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_HOST,
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    this.client.interceptors.response.use(
      (response) => {
        return response.data;
      },
      async (error) => {
        if (error.response.status === 401) {
          const { data } = await axios.get(
            `${import.meta.env.VITE_API_HOST}/auth/refresh`,
            { withCredentials: true }
          );
          // signIn(data.access_token);
          console.log(data, "-==-=--=-=-==-");
          error.config.headers["Authorization"] = "Bearer " + data.access_token;
          return this.client.request(error.config);
        }
      }
    );
  }
}
