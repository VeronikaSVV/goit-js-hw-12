import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { getImagesByQuery } from "./js/pixabay-api.js";
import {
  createGallery,
  clearGallery,
  showLoader,
hideLoader,
showLoadMoreButton,
hideLoadMoreButton,
} from "./js/render-functions.js";


const form = document.querySelector(".form");
const input = document.querySelector(".input");
const loadBtn = document.querySelector(".button-load");
 
loadBtn.addEventListener("click", onLoadMore);
let page = 1;
let query = "";

form.addEventListener("submit", handleSubmit);


async function handleSubmit(event) { 
    
    event.preventDefault();

    query = input.value.trim();
    page = 1;


    if (!query) {
        iziToast.warning({
            message: "Please fill in the search field!",
            position: "topRight",
        });
        return;
    }

    clearGallery();  
    hideLoadMoreButton();
    showLoader();
    
    try {
        const data = await getImagesByQuery(query, page);
        if (data.hits.length === 0) {
            iziToast.error({
            message: "Sorry, there are no images matching your search query. Please try again!",
            position: "topRight",
        });
        return;
        }
        
        createGallery(data.hits);
        const totalPages = Math.ceil(data.totalHits / 15);

        if (page >= totalPages) {
            hideLoadMoreButton();
            
            iziToast.info({
            message: "We're sorry, but you've reached the end of search results.",
            position: "topRight",
  });
} else {
    showLoadMoreButton();
}
    } catch(error ) {
        iziToast.error({
        message: error.message,
        position: "topRight",
      });
    } finally {
            hideLoader();
            event.target.reset();
        }

}

async function onLoadMore() {
    page++;

    hideLoadMoreButton();
    showLoader();

    try {
        const data = await getImagesByQuery(query, page);

        createGallery(data.hits);

        const galleryCard = document.querySelector(".gallery-item");
        const cardHeight = galleryCard.getBoundingClientRect().height;

        window.scrollBy({
            top: cardHeight * 2,
            behavior: "smooth",
        });

        const totalPages = Math.ceil(data.totalHits / 15);

        if (page < totalPages) {
            showLoadMoreButton();
        } else {
            hideLoadMoreButton();

            iziToast.info({
                message: "We're sorry, but you've reached the end of search results.",
                position: "topRight",
            });
        }

    } catch (error) {
        iziToast.error({
            message: error.message,
            position: "topRight",
        });
    } finally {
        hideLoader();
    }
}