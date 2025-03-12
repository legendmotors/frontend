"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function CurrencySelector() {
    const router = useRouter();
    const [currency, setCurrency] = useState("AED");

    const currencies = [
        { code: "AED", label: "AED" },
        { code: "USD", label: "USD" }
    ];

    useEffect(() => {
        const savedCurrency = Cookies.get("NEXT_CURRENCY") || "AED"; // Default to AED
        setCurrency(savedCurrency);
    }, []);

    const handleCurrencyChange = (code) => {
        setCurrency(code);
        Cookies.set("NEXT_CURRENCY", code, { expires: 365 }); // Store in cookies

        // Dispatch a custom event to notify other components
        window.dispatchEvent(new Event("currencyChange"));

        router.refresh(); // Refresh the page
    };

    return (
        <div className="dropdown">
            <button
                className="btn btn-light dropdown-toggle"
                type="button"
                id="currencyDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                {currencies.find((cur) => cur.code === currency)?.label || "Select Currency"}
            </button>
            <ul className="dropdown-menu p-0" aria-labelledby="currencyDropdown">
                {currencies.map((cur) => (
                    <li key={cur.code} className="me-0 ms-0" onClick={() => handleCurrencyChange(cur.code)}>
                        <div >{cur.label}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
