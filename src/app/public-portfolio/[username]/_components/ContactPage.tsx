'use client';

import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Portfolio } from '@/types/portfolio';

// Import from centralized animation system
import {
  parentVariants,
  fullSlideLeftVariants,
  fullSlideRightVariants,
  fadeUpVariants,
  defaultViewport,
  buttonHover,
  buttonTap,
  spinVariants
} from '@/lib/animations';
import LaptopWithFloatingGmail from '@/components/LaptopWithFloatingGmail';
import { is } from '@react-three/fiber/dist/declarations/src/core/utils';

type ContactProps = {
  portfolio: Portfolio;
};

const Contact: React.FC<ContactProps> = ({ portfolio }) => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });
  // Removed formKey
  const [loading, setLoading] = useState(false);
  const isMountedRef = useRef(true);

  // Cleanup function for component unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validateForm = () => {
    const { name, email, message } = form;

    type Current = {
      name: boolean;
      email: boolean;
      message: boolean;
    };

    const nameError = document.querySelector("#name-error")!;
    const emailError = document.querySelector("#email-error")!;
    const messageError = document.querySelector("#message-error")!;
    const current: Current = { name: false, email: false, message: false };

    // Validate name
    if (name.trim().length < 3) {
      nameError.classList.remove("hidden");
      current["name"] = false;
    } else {
      nameError.classList.add("hidden");
      current["name"] = true;
    }

    // Validate email
    const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!email.trim().toLowerCase().match(emailRegex)) {
      emailError.classList.remove("hidden");
      current["email"] = false;
    } else {
      emailError.classList.add("hidden");
      current["email"] = true;
    }

    // Validate message
    if (message.trim().length < 5) {
      messageError.classList.remove("hidden");
      current["message"] = false;
    } else {
      messageError.classList.add("hidden");
      current["message"] = true;
    }

    return Object.keys(current).every((k) => current[k as keyof typeof current]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly.');
      setLoading(false);
      return false;
    }

    setLoading(true);

    // Show loading toast
    const loadingToast = toast.loading('Sending your message...', {
      description: 'Please wait while we process your request.'
    });

    try {
      const formSnapshot = { ...form }; // capture form state at submit time
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerEmail: portfolio.email,
          ownerName: portfolio.fullName,
          userName: formSnapshot.name,
          userEmail: formSnapshot.email,
          message: formSnapshot.message,
        }),
      });

      // Parse response first, then dismiss loading toast
      let responseData;
      try {
        responseData = await res.json();
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        setLoading(false);
        toast.dismiss(loadingToast);
        throw new Error('Invalid response from server');
      }

      // console.log('Response Data:', responseData);
      // console.log('Response Status:', res);
      // console.log(isMountedRef.current);

      // Replace the section after toast.dismiss(loadingToast); with this:

      toast.dismiss(loadingToast);

      // if (!isMountedRef.current) {
      //   setLoading(false);
      //   return;
      // }



      if (res.ok && responseData.success) {
        setForm({ name: '', email: '', message: '' });
        setLoading(false);
        toast.success('Message sent successfully! 🎉', {
          description: `Thanks ${formSnapshot.name}! I'll get back to you soon.`,
          duration: 5000,
        });

        if (responseData.warnings?.includes('Acknowledgment email failed')) {
          setTimeout(() => {
            if (isMountedRef.current) {
              toast.warning('Note: Confirmation email may not have been sent', {
                description: 'Your message was received, but there was an issue sending the confirmation email.',
                duration: 4000,
              });
            }
          }, 1000);
        }

      } else if (res.ok && !responseData.success) {
        // Server returned 200 but operation failed
        const errorMessage = responseData.error || 'Request failed.';
        setLoading(false);
        toast.error('Failed to send message', {
          description: errorMessage,
          duration: 6000,
        });
        console.error('API Error (success: false):', responseData);
      } else {
        // HTTP error or server error
        const errorMessage = responseData?.error || `Server error (${res.status})`;
        setLoading(false);
        toast.error('Failed to send message', {
          description: errorMessage,
          duration: 6000,
        });
        console.error('HTTP Error:', { status: res.status, data: responseData });
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      if (!isMountedRef.current) {
        setLoading(false);
        return;
      }
      console.error('[CONTACT_ERROR]: ', err);
      if (err instanceof TypeError && err.message.includes('fetch')) {
        toast.error('Network error occurred', {
          description: 'Please check your connection and try again.',
          duration: 6000,
        });
      } else if (err instanceof Error && err.message.includes('Invalid response')) {
        toast.error('Server response error', {
          description: 'Unable to process server response. Please try again.',
          duration: 6000,
        });
      } else {
        toast.error('Something went wrong', {
          description: 'Unable to process your request. Please try again.',
          duration: 6000,
        });
      }
      setLoading(false);
    }
  };

  return (
    <div id="contact" className="relative overflow-hidden">
      {/* Background glass effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Title with fadeUpVariants */}
      <motion.div
        className="mb-8 text-center w-full"
        variants={fadeUpVariants}
        initial="hidden"
        whileInView="show"
        viewport={defaultViewport}
      >
        <h3 className={`font-geisSans text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent dark:from-blue-300 dark:to-purple-500`}>
          Contact<span className="text-blue-400">.</span>
        </h3>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Using parentVariants for staggered animation */}
        <motion.div
          className="xl:mt-12 xl:flex-row flex flex-col lg:flex-row lg:gap-4 gap-0 overflow-hidden"
          variants={parentVariants}
          initial="hidden"
          whileInView="show"
          viewport={defaultViewport}
        >
          {/* Form Section - Using fullSlideLeftVariants */}
          <motion.div
            variants={fullSlideLeftVariants}
            className="w-full lg:flex-[0.75] lg:pl-8"
          >
            <div className="relative z-10">
              {/* Form */}
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="flex flex-col gap-8"
              >
                {/* Name Field */}
                <motion.label
                  htmlFor="name"
                  className="flex flex-col"
                  variants={fadeUpVariants}
                >
                  <span className="text-white font-medium mb-4 text-lg">Your Name*</span>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    title="What's your name?"
                    disabled={loading}
                    aria-disabled={loading}
                    className="py-4 px-6 placeholder:text-gray-400 text-white rounded-lg outline-none border-none font-medium transition-all duration-300 focus:ring-2 focus:ring-blue-400/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: 'rgba(15, 23, 42, 0.4)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  />
                  <span className="text-red-400 mt-2 hidden text-sm" id="name-error">
                    Name must be at least 3 characters long!
                  </span>
                </motion.label>

                {/* Email Field */}
                <motion.label
                  htmlFor="email"
                  className="flex flex-col"
                  variants={fadeUpVariants}
                >
                  <span className="text-white font-medium mb-4 text-lg">Your Email*</span>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="johndoe@email.com"
                    title="What's your email?"
                    disabled={loading}
                    aria-disabled={loading}
                    className="py-4 px-6 placeholder:text-gray-400 text-white rounded-lg outline-none border-none font-medium transition-all duration-300 focus:ring-2 focus:ring-blue-400/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: 'rgba(15, 23, 42, 0.4)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  />
                  <span className="text-red-400 mt-2 hidden text-sm" id="email-error">
                    Please enter a valid email address!
                  </span>
                </motion.label>

                {/* Message Field */}
                <motion.label
                  htmlFor="message"
                  className="flex flex-col"
                  variants={fadeUpVariants}
                >
                  <span className="text-white font-medium mb-4 text-lg">Your Message*</span>
                  <textarea
                    rows={7}
                    name="message"
                    id="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Hello there!"
                    title="What do you want to say?"
                    disabled={loading}
                    aria-disabled={loading}
                    className="py-4 px-6 placeholder:text-gray-400 text-white rounded-lg outline-none border-none font-medium resize-none transition-all duration-300 focus:ring-2 focus:ring-blue-400/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: 'rgba(15, 23, 42, 0.4)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  />
                  <span className="text-red-400 mt-2 hidden text-sm" id="message-error">
                    Message must be at least 5 characters long!
                  </span>
                </motion.label>

                {/* Submit Button - Using AnimatedButton or motion.button with centralized animations */}
                <motion.button
                  type="submit"
                  title={loading ? "Sending..." : "Send"}
                  variants={fadeUpVariants}
                  whileTap={loading ? undefined : buttonTap}
                  className="py-4 px-8 outline-none w-fit text-white font-bold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                  disabled={loading}
                  aria-disabled={loading}
                  style={{
                    background: loading
                      ? 'rgba(71, 85, 105, 0.5)'
                      : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: loading
                      ? 'none'
                      : '0 10px 20px rgba(59, 130, 246, 0.4), 0 6px 6px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                  }}
                >
                  {loading ? (
                    <span className="flex items-center gap-3">
                      {/* Using Spinner component or motion.div with spinVariants */}
                      <motion.svg
                        variants={spinVariants}
                        animate="animate"
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </motion.svg>
                      Sending...
                    </span>
                  ) : (
                    'Send'
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* 3D Component Section - Only on lg and up */}
          <motion.div
            variants={fullSlideRightVariants}
            className="hidden lg:flex xl:flex-1 xl:h-auto lg:h-[700px] h-[600px] items-center justify-center relative"
          >
            <div className="relative z-10 w-full h-full flex items-center justify-center">
              <div className="w-full h-full flex items-center justify-center">
                {/* <FordMustang /> */}
                <LaptopWithFloatingGmail />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;