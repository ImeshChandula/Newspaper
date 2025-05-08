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
import { AnimatePresence, motion } from "framer-motion";

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
                className="btn btn-outline-dark d-flex align-items-center gap-1 text-nowrap"
                onClick={toggleDropdown}
            >
                <FiShare2 size={18} />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        className="dropdown-menu p-3 show bg-white border border-dark"
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            display: "block",
                            minWidth: "200px",
                            maxWidth: "90vw",
                            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
                            right: 0,
                            left: "auto",
                            position: "absolute",
                            zIndex: 1000,
                        }}
                    >
                        <div className="d-flex flex-wrap gap-2 mb-2 justify-content-center">
                            <FacebookShareButton url={url} quote={title}>
                                <FacebookIcon size={32} round />
                            </FacebookShareButton>
                            <WhatsappShareButton url={url} title={title}>
                                <WhatsappIcon size={32} round />
                            </WhatsappShareButton>
                            <EmailShareButton url={url} subject={title}>
                                <EmailIcon size={32} round />
                            </EmailShareButton>
                        </div>
                        <button
                            onClick={copyToClipboard}
                            className="btn btn-sm btn-outline-dark w-100"
                        >
                            {copied ? "Link Copied!" : "Copy Link"}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ShareButton;
