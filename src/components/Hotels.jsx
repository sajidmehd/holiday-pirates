import { useState } from "react";
import Hotel from "./Hotel";
import axios from "axios";

function Hotels() {
  const baseUrl = "https://cdn.contentful.com/spaces/";
  const spaceId = "gyfunrv4a4ak";
  const accessToken = "k9P9FQJcUpHKrHX3tXrgXunRyiS3qPchtY7V61tNruE";
  const url = `${baseUrl}/${spaceId}/entries?access_token=${accessToken}`;

  // const [images, setImages] = useState([]);
  // const [hotels, setHotels] = useState([]);

  // const handleLoadHotels = async () => {
  //   await axios
  //     .get(url)
  //     .then((res) => {
  //       setImages(res.data.includes.Asset);
  //       let temp_hotels = [];
  //       let temp_reviews = [];
  //       let temp_customers = [];

  //       res.data.items.forEach((item) => {
  //         if (item.sys.contentType.sys.id === "customer") {
  //           temp_customers.push({
  //             fields: item.fields,
  //             id: item.sys.id,
  //           });
  //         }
  //       });
  //       res.data.items.forEach((item) => {
  //         if (item.sys.contentType.sys.id === "review") {
  //           let temp = [];
  //           temp_customers.forEach((cust) => {
  //             if (cust.id === item.fields.customer.sys.id) {
  //               temp.push(cust);
  //             }
  //           });
  //           temp_reviews.push({
  //             fields: item.fields,
  //             id: item.sys.id,
  //             customer: temp,
  //           });
  //         }
  //       });

  //       res.data.items.forEach((item) => {
  //         if (item.sys.contentType.sys.id === "hotel") {
  //           let temp = [];
  //           let assets = [];
  //           temp_reviews.forEach((review) => {
  //             if (review.fields.hotel.sys.id === item.sys.id) {
  //               temp.push(review);
  //             }
  //           });
  //           images.forEach((image) => {
  //             if (image.sys.id === item.fields.images[0].sys.id) {
  //               assets.push(image.fields);
  //             }
  //           });

  //           temp_hotels.push({
  //             fields: item.fields,
  //             id: item.sys.id,
  //             reviews: temp,
  //             assets: assets,
  //           });
  //         }
  //       });

  //       setHotels(temp_hotels);
  //     })
  //     .catch((e) => {
  //       console.log(e);
  //     });
  // };

  const [hotels, setHotels] = useState([]);

  const handleLoadHotels = async () => {
    try {
      const res = await axios.get(url);
      const imagesMap = new Map(
        res.data.includes.Asset.map((asset) => [asset.sys.id, asset.fields])
      );

      const hotels = res.data.items
        .filter((item) => item.sys.contentType.sys.id === "hotel")
        .map((item) => {
          const reviews = res.data.items
            .filter(
              (subItem) =>
                subItem.sys.contentType.sys.id === "review" &&
                subItem.fields.hotel.sys.id === item.sys.id
            )
            .map((review) => {
              const customer = res.data.items.find(
                (subItem) =>
                  subItem.sys.contentType.sys.id === "customer" &&
                  subItem.sys.id === review.fields.customer.sys.id
              );
              return {
                fields: review.fields,
                id: review.sys.id,
                customer: customer ? customer.fields : null,
              };
            });

          const assets = item.fields.images.map((image) =>
            imagesMap.get(image.sys.id)
          );

          return { fields: item.fields, id: item.sys.id, reviews, assets };
        });

      setHotels(hotels);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <button className="btn" onClick={handleLoadHotels}>
        Load Hotels
      </button>
      <div className="hotels">
        {hotels.map((hotel) => {
          return <Hotel key={hotel.id} hotel={hotel} />;
        })}
      </div>
    </>
  );
}

export default Hotels;
