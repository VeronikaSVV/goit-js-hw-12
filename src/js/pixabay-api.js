import axios from "axios";

const API_KEY = "55630805-566a496cfd8411b4d8839b448";

export async function getImagesByQuery(query, page = 1) {
  
  const response = await axios.get("https://pixabay.com/api/", {
    params: {
      key: API_KEY,
      q: query,
      page: page,
      per_page: 15,
      image_type: "photo",
      orientation: "horizontal",
      safesearch: true,
    },
  });
  return response.data;
}