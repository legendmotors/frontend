import ShareButton from "@/components/social/ShareButton";
import { formatCurrency } from "@/utils/formatCurrency";
import React from "react";

export default function CarInfo({ carResponse, currency, convertedPrice }) {
  // Extract additional details from the response if available.
  const bodyTypeSpecification = carResponse.SpecificationValues.find(
    (spec) => spec.Specification.key === "body_type"
  );

  const fuelTypeSpecification = carResponse.SpecificationValues.find(
    (spec) => spec.Specification.key === "fuel_type"
  );

  const regionalSpecification = carResponse.SpecificationValues.find(
    (spec) => spec.Specification.key === "regional_specification"
  );

  const steeringSideSpecification = carResponse.SpecificationValues.find(
    (spec) => spec.Specification.key === "steering_side"
  );

  const transmission = carResponse.SpecificationValues.find(
    (spec) => spec.Specification.key === "transmission"
  );


  // Extract the body type name if it exists
  const bodyTypeName = bodyTypeSpecification?.name || "N/A";

  const fuelTypeName = fuelTypeSpecification?.name || "N/A"
  const transmissionName = transmission?.name || "N/A";
  const regionalSpecificationName = regionalSpecification?.name || "N/A";
  const steeringSideSpecificationName = steeringSideSpecification?.name || "N/A";
  const displayPrice = carResponse?.CarPrices?.find(item => item.currency === currency);
  return (
    <>
      <div className="icon-box flex flex-wrap my-2">
        <div className="icons flex-three gap-1">
          <i className="fa fa-cogs" />
          <span>{carResponse.engineSize} ltr</span>
        </div>
        <div className="icons flex-three gap-1">
          <i className="fa fa-gas-pump" />
          <span>{fuelTypeName}</span>
        </div>
        <div className="icons flex-three gap-1">
          <i className="fa fa-exchange-alt" />
          <span>{transmissionName}</span>
        </div>

        <div className="icons flex-three gap-1">
          <i className="fa fa-flag" />
          <span>{regionalSpecificationName}</span>
        </div>
        <div className="icons flex-three gap-1">
          <i className="fa fa-steering-wheel" />
          <span>{steeringSideSpecificationName}</span>
        </div>

      </div>

      <div className="money text-color-3 font">
        {displayPrice?.currency} {formatCurrency(displayPrice?.price, displayPrice?.currency)}
      </div>

      <ul className="action-icon flex flex-wrap">
        <li>
          <a href="#" className="icon">
            <ShareButton />
          </a>
        </li>
        {/* <div className="list-file">
          <a target="_blank" href="#" className="button border p-1 rounded" download="">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={30}
              height={30}
              viewBox="0 0 30 30"
              fill="none"
            >
              <path
                d="M26.8125 2.20341V27.7961C26.8125 28.1471 26.6731 28.4837 26.4248 28.7319C26.1766 28.9801 25.84 29.1196 25.489 29.1196H4.51103C4.16001 29.1196 3.82336 28.9801 3.57515 28.7319C3.32694 28.4837 3.1875 28.1471 3.1875 27.7961V6.19165H7.18015C7.53117 6.19165 7.86781 6.0522 8.11602 5.804C8.36423 5.55579 8.50368 5.21914 8.50368 4.86812V0.879883H25.489C25.84 0.879883 26.1766 1.01933 26.4248 1.26754C26.6731 1.51575 26.8125 1.85239 26.8125 2.20341Z"
                fill="#E9EDF4"
              />
              <path
                d="M3.1875 6.19165H7.18015C7.53117 6.19165 7.86781 6.0522 8.11602 5.804C8.36423 5.55579 8.50368 5.21914 8.50368 4.86812L3.1875 6.19165Z"
                fill="#D2DBEA"
              />
              <path
                d="M28.2352 17.2884V23.4296C28.2352 23.7806 28.0958 24.1172 27.8476 24.3654C27.5994 24.6136 27.2627 24.7531 26.9117 24.7531H3.08818C2.73716 24.7531 2.40051 24.6136 2.1523 24.3654C1.90409 24.1172 1.76465 23.7806 1.76465 23.4296V17.2884C1.76465 16.9374 1.90409 16.6007 2.1523 16.3525C2.40051 16.1043 2.73716 15.9648 3.08818 15.9648H26.9117C27.2627 15.9648 27.5994 16.1043 27.8476 16.3525C28.0958 16.6007 28.2352 16.9374 28.2352 17.2884Z"
                fill="#FF7101"
              />
              <path
                d="M23.1764 9.92459C23.1764 10.2414 22.924 10.4937 22.6073 10.4937H7.39285C7.24191 10.4937 7.09715 10.4337 6.99042 10.327C6.88369 10.2203 6.82373 10.0755 6.82373 9.92459C6.82373 9.77365 6.88369 9.62889 6.99042 9.52216C7.09715 9.41543 7.24191 9.35547 7.39285 9.35547H22.6073C22.924 9.35547 23.1764 9.60782 23.1764 9.92459ZM23.1764 12.8408C23.1764 13.1575 22.924 13.4099 22.6073 13.4099H7.39285C7.24191 13.4099 7.09715 13.3499 6.99042 13.2432C6.88369 13.1365 6.82373 12.9917 6.82373 12.8408C6.82373 12.6898 6.88369 12.5451 6.99042 12.4383C7.09715 12.3316 7.24191 12.2716 7.39285 12.2716H22.6073C22.924 12.2716 23.1764 12.5244 23.1764 12.8408Z"
                fill="#D2DBEA"
              />
            </svg>
            Download brochure
          </a>
        </div> */}
      </ul>
    </>
  );
}
