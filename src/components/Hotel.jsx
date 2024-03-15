import React, { useState } from "react";
import { MdOutlineStarPurple500, MdStarOutline } from "react-icons/md";
import { GoPlus } from "react-icons/go";
import { HiMinusSmall } from "react-icons/hi2";

function Hotel({ hotel }) {
  const [review, setReview] = useState([]);
  const [isReview, setIsReview] = useState(false);
  const fields = hotel.fields;
  const hotelReviews = hotel.reviews;

  let rating = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= fields.rating) {
      rating.push(<MdOutlineStarPurple500 />);
    } else {
      rating.push(<MdStarOutline />);
    }
  }

  const handleShowReview = () => {
    setReview(hotelReviews);
    setIsReview(!isReview);
  };

  function formatDate(date) {
    // Split the input date into an array of year, month, and day
    const [year, month, day] = date.split("-");

    // Return the formatted date as "DD.MM.YYYY"
    return `${day}.${month}.${year}`;
  }

  return (
    <>
      <div className="hotel">
        <div className="hotel_image">
          <img src={hotel.assets[0]?.file.url} alt={hotel.assets[0]?.title} />
        </div>
        <div className="hotel_content">
          <header>
            <div className="name_city">
              <h2>{fields.name}</h2>
              <p>{`${fields.city} - ${fields.country}`}</p>
            </div>
            <div className="rating">{rating}</div>
          </header>
          <div className="content">
            {fields.description.content.map((item) => {
              return <p>{item.content[0].value}</p>;
            })}
          </div>
          <footer>
            <button className="btn" onClick={handleShowReview}>
              Show Reviews
            </button>
            <div className="price_time">
              <h3>{`${fields.price.value} ${fields.price.symbol}`}</h3>
              <span>{`${formatDate(fields.startDate)} - ${formatDate(
                fields.endDate
              )}`}</span>
            </div>
          </footer>
        </div>
      </div>
      <div className={`reviews ${isReview ? "active" : "inactive"}`}>
        {review.map((item) => {
          return (
            <div className="review_list">
              <div className="positive_negative">
                {item.fields.feedback === "positive" ? (
                  <GoPlus />
                ) : (
                  <HiMinusSmall />
                )}
              </div>
              <div className="review">
                <h4>{`${item.customer.firstName} ${item.customer.lastName}`}</h4>

                {item.fields.comment.content.map((description) => {
                  return <p>{description.content[0].value}</p>;
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Hotel;
