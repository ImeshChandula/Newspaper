import React, { useState, useRef, useEffect } from "react";
import {
    FacebookShareButton,
    TwitterShareButton,
    WhatsappShareButton,
    EmailShareButton,
    FacebookIcon,
    TwitterIcon,
    WhatsappIcon,
    EmailIcon,
} from "react-share";
import { FiShare2 } from "react-icons/fi";

const ShareButton = ({ url, title }) => {
    const [open, setOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => setOpen(!open);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="position-relative d-inline-block" ref={dropdownRef}>
            <button
                className="btn btn-outline-primary d-flex align-items-center gap-1 text-nowrap"
                onClick={toggleDropdown}
            >
                <FiShare2 size={18} />
                <span className="d-none d-sm-inline">Share</span>
            </button>

            {open && (
                <div
                    className="dropdown-menu p-3 show"
                    style={{
                        display: "block",
                        minWidth: "200px",
                        maxWidth: "90vw",
                        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
                        right: 0,
                        left: "auto",
                    }}
                >
                    <div className="d-flex flex-wrap gap-2 mb-2 justify-content-start">
                        <FacebookShareButton url={url} quote={title}>
                            <FacebookIcon size={32} round />
                        </FacebookShareButton>
                        <TwitterShareButton url={url} title={title}>
                            <TwitterIcon size={32} round />
                        </TwitterShareButton>
                        <WhatsappShareButton url={url} title={title}>
                            <WhatsappIcon size={32} round />
                        </WhatsappShareButton>
                        <EmailShareButton url={url} subject={title}>
                            <EmailIcon size={32} round />
                        </EmailShareButton>
                    </div>
                    <button onClick={copyToClipboard} className="btn btn-sm btn-outline-secondary w-100">
                        {copied ? "Link Copied!" : "Copy Link"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ShareButton;
