import React, { useEffect, useMemo, useRef, useState } from "react";
import "./Header.css";
import logo from "../../assets/icons/logo.svg";

const mainNavLinks = [
  {
    id: 1,
    label: "Website Templates",
    path: "/",
  },
  {
    id: 2,
    label: "About",
    path: "/about",
  },
  {
    id: 3,
    label: "Faqs",
    path: "/faqs",
  },
  {
    id: 4,
    label: "Contact",
    path: "/contact",
  },
];

const categories = [
  "All Items",
  "Ecommerce",
  "Business",
  "Entertainment",
  "Personal",
  "Portfolio",
  "Studio",
  "Technology",
  "Corporate",
  "Retails",
];

const countries = [
  {
    id: "bd",
    name: "Bangladesh",
    shortName: "BD",
    code: "+880",
    flag: "https://flagcdn.com/w40/bd.png",
  },
  {
    id: "in",
    name: "India",
    shortName: "IN",
    code: "+91",
    flag: "https://flagcdn.com/w40/in.png",
  },
  {
    id: "pk",
    name: "Pakistan",
    shortName: "PK",
    code: "+92",
    flag: "https://flagcdn.com/w40/pk.png",
  },
  {
    id: "lk",
    name: "Sri Lanka",
    shortName: "LK",
    code: "+94",
    flag: "https://flagcdn.com/w40/lk.png",
  },
  {
    id: "np",
    name: "Nepal",
    shortName: "NP",
    code: "+977",
    flag: "https://flagcdn.com/w40/np.png",
  },
  {
    id: "us",
    name: "United States",
    shortName: "US",
    code: "+1",
    flag: "https://flagcdn.com/w40/us.png",
  },
  {
    id: "gb",
    name: "United Kingdom",
    shortName: "UK",
    code: "+44",
    flag: "https://flagcdn.com/w40/gb.png",
  },
  {
    id: "ca",
    name: "Canada",
    shortName: "CA",
    code: "+1",
    flag: "https://flagcdn.com/w40/ca.png",
  },
  {
    id: "au",
    name: "Australia",
    shortName: "AU",
    code: "+61",
    flag: "https://flagcdn.com/w40/au.png",
  },
  {
    id: "fr",
    name: "France",
    shortName: "FR",
    code: "+33",
    flag: "https://flagcdn.com/w40/fr.png",
  },
  {
    id: "de",
    name: "Germany",
    shortName: "DE",
    code: "+49",
    flag: "https://flagcdn.com/w40/de.png",
  },
  {
    id: "it",
    name: "Italy",
    shortName: "IT",
    code: "+39",
    flag: "https://flagcdn.com/w40/it.png",
  },
  {
    id: "es",
    name: "Spain",
    shortName: "ES",
    code: "+34",
    flag: "https://flagcdn.com/w40/es.png",
  },
  {
    id: "pt",
    name: "Portugal",
    shortName: "PT",
    code: "+351",
    flag: "https://flagcdn.com/w40/pt.png",
  },
  {
    id: "ae",
    name: "United Arab Emirates",
    shortName: "AE",
    code: "+971",
    flag: "https://flagcdn.com/w40/ae.png",
  },
];

const initialLoginData = {
  email: "",
  password: "",
  remember: false,
};

const initialSignupData = {
  fullName: "",
  email: "",
  password: "",
  phone: "",
};

const initialForgotData = {
  email: "",
  password: "",
  confirmPassword: "",
};

function Header({
  cartCount = 0,
  onNavChange,
  onCategoryChange,
  onSearchChange,
  onCartClick,
}) {
  const countryDropdownRef = useRef(null);

  const [activeNav, setActiveNav] = useState(1);
  const [hoveredNav, setHoveredNav] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All Items");
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [isTopMenuOpen, setIsTopMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authView, setAuthView] = useState("login");
  const [loginRole, setLoginRole] = useState("seller");
  const [signupRole, setSignupRole] = useState("seller");

  const [loginData, setLoginData] = useState(initialLoginData);
  const [signupData, setSignupData] = useState(initialSignupData);
  const [forgotData, setForgotData] = useState(initialForgotData);

  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [isCountryOpen, setIsCountryOpen] = useState(false);

  const [showPassword, setShowPassword] = useState({
    login: false,
    signup: false,
    forgotNew: false,
    forgotConfirm: false,
  });

  const [demoOtp, setDemoOtp] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [errors, setErrors] = useState({});
  const [authMessage, setAuthMessage] = useState({
    type: "",
    text: "",
  });

  const fullSignupPhone = useMemo(() => {
    return `${selectedCountry.code} ${signupData.phone}`.trim();
  }, [selectedCountry.code, signupData.phone]);

  const resetAllAuthForms = () => {
    setLoginData(initialLoginData);
    setSignupData(initialSignupData);
    setForgotData(initialForgotData);
    setSelectedCountry(countries[0]);
    setIsCountryOpen(false);
    setDemoOtp("");
    setOtpValue("");
    setErrors({});
    setAuthMessage({
      type: "",
      text: "",
    });
    setShowPassword({
      login: false,
      signup: false,
      forgotNew: false,
      forgotConfirm: false,
    });
  };

  useEffect(() => {
    resetAllAuthForms();
  }, []);

  useEffect(() => {
    if (isAuthOpen) {
      document.body.classList.add("auth-modal-open");
    } else {
      document.body.classList.remove("auth-modal-open");
    }

    return () => {
      document.body.classList.remove("auth-modal-open");
    };
  }, [isAuthOpen]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(event.target)
      ) {
        setIsCountryOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const getNavClassName = (itemId) => {
    if (hoveredNav === itemId) {
      return "hovered";
    }

    if (hoveredNav === null && activeNav === itemId) {
      return "active";
    }

    return "";
  };

  const getCategoryClassName = (category) => {
    if (hoveredCategory === category) {
      return "hovered";
    }

    if (hoveredCategory === null && activeCategory === category) {
      return "active";
    }

    return "";
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
  };

  const isStrongPassword = (password) => {
    return String(password).length >= 6;
  };

  const clearAuthFeedback = () => {
    setErrors({});
    setAuthMessage({
      type: "",
      text: "",
    });
  };

  const setSuccessMessage = (text) => {
    setAuthMessage({
      type: "success",
      text,
    });
  };

  const resetSignupFlow = () => {
    setSignupData(initialSignupData);
    setDemoOtp("");
    setOtpValue("");
    setErrors({});
    setAuthMessage({
      type: "",
      text: "",
    });
    setSelectedCountry(countries[0]);
    setIsCountryOpen(false);
  };

  const handleNavClick = (event, item) => {
    event.preventDefault();

    setActiveNav(item.id);
    setHoveredNav(null);
    setIsTopMenuOpen(false);

    if (onNavChange) {
      onNavChange(item);
    }
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setHoveredCategory(null);
    setIsCategoryMenuOpen(false);

    if (onCategoryChange) {
      onCategoryChange(category);
    }
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchValue(value);

    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  const handleCartClick = () => {
    if (onCartClick) {
      onCartClick();
    }
  };

  const closeDrawer = () => {
    setIsTopMenuOpen(false);
    setHoveredNav(null);
  };

  const openAuthModal = (view = "login") => {
    resetAllAuthForms();
    setAuthView(view);
    setIsAuthOpen(true);
    setIsTopMenuOpen(false);
    setIsCountryOpen(false);
  };

  const closeAuthModal = () => {
    setIsAuthOpen(false);
    setAuthView("login");
    setIsCountryOpen(false);
    resetAllAuthForms();
  };

  const switchAuthView = (view) => {
    setAuthView(view);
    setDemoOtp("");
    setOtpValue("");
    setIsCountryOpen(false);
    clearAuthFeedback();
  };

  const togglePassword = (key) => {
    setShowPassword((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleLoginChange = (event) => {
    const { name, value, type, checked } = event.target;

    setLoginData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setAuthMessage({
      type: "",
      text: "",
    });
  };

  const handleSignupChange = (event) => {
    const { name, value } = event.target;

    if (name === "phone") {
      const code = selectedCountry.code;
      const cleanValue = value
        .replace(code, "")
        .replace(/\+/g, "")
        .replace(/\s/g, "")
        .replace(/\D/g, "")
        .slice(0, 15);

      setSignupData((prev) => ({
        ...prev,
        phone: cleanValue,
      }));

      setErrors((prev) => ({
        ...prev,
        phone: "",
      }));

      setAuthMessage({
        type: "",
        text: "",
      });

      return;
    }

    setSignupData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setAuthMessage({
      type: "",
      text: "",
    });
  };

  const handleForgotChange = (event) => {
    const { name, value } = event.target;

    setForgotData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setAuthMessage({
      type: "",
      text: "",
    });
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setIsCountryOpen(false);

    setErrors((prev) => ({
      ...prev,
      phone: "",
    }));
  };

  const validateLogin = () => {
    const nextErrors = {};

    if (!loginData.email.trim()) {
      nextErrors.email = "Email or username is required.";
    }

    if (!loginData.password.trim()) {
      nextErrors.password = "Password is required.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const validateSignup = () => {
    const nextErrors = {};

    if (!signupData.fullName.trim()) {
      nextErrors.fullName = "Full name is required.";
    } else if (signupData.fullName.trim().length < 3) {
      nextErrors.fullName = "Full name must be at least 3 characters.";
    }

    if (!signupData.email.trim()) {
      nextErrors.email = "Email address is required.";
    } else if (!isValidEmail(signupData.email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!signupData.password.trim()) {
      nextErrors.password = "Password is required.";
    } else if (!isStrongPassword(signupData.password)) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    if (!signupData.phone.trim()) {
      nextErrors.phone = "Phone number is required.";
    } else if (signupData.phone.length < 7) {
      nextErrors.phone = "Please enter a valid phone number.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const validateSignupOtp = () => {
    const nextErrors = {};

    if (!otpValue.trim()) {
      nextErrors.otp = "OTP is required.";
    } else if (otpValue.length !== 4) {
      nextErrors.otp = "OTP must be 4 digits.";
    } else if (otpValue !== demoOtp) {
      nextErrors.otp = "Invalid OTP. Please enter the demo OTP shown above.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const validateForgot = () => {
    const nextErrors = {};

    if (!forgotData.email.trim()) {
      nextErrors.email = "Email address is required.";
    } else if (!isValidEmail(forgotData.email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!forgotData.password.trim()) {
      nextErrors.password = "New password is required.";
    } else if (!isStrongPassword(forgotData.password)) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    if (!forgotData.confirmPassword.trim()) {
      nextErrors.confirmPassword = "Confirm password is required.";
    } else if (forgotData.password !== forgotData.confirmPassword) {
      nextErrors.confirmPassword = "Password does not match.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();

    if (!validateLogin()) {
      return;
    }

    setSuccessMessage("Signed in successfully.");

    setTimeout(() => {
      closeAuthModal();
    }, 800);
  };

  const handleSignupSubmit = (event) => {
    event.preventDefault();

    if (!validateSignup()) {
      return;
    }

    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();

    setDemoOtp(newOtp);
    setOtpValue("");
    setErrors({});
    setAuthMessage({
      type: "",
      text: "",
    });
    setAuthView("signupOtp");
  };

  const handleSignupOtpSubmit = (event) => {
    event.preventDefault();

    if (!validateSignupOtp()) {
      return;
    }

    setSuccessMessage("Account created successfully.");

    setTimeout(() => {
      setLoginData((prev) => ({
        ...prev,
        email: signupData.email,
        password: "",
      }));

      resetSignupFlow();
      closeAuthModal();
    }, 800);
  };

  const handleResendSignupOtp = () => {
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();

    setDemoOtp(newOtp);
    setOtpValue("");
    setErrors({});
    setSuccessMessage("New OTP generated successfully.");
  };

  const handleForgotSubmit = (event) => {
    event.preventDefault();

    if (!validateForgot()) {
      return;
    }

    setSuccessMessage("Password updated successfully.");

    setTimeout(() => {
      setForgotData(initialForgotData);
      setAuthView("login");
      setErrors({});
      setAuthMessage({
        type: "success",
        text: "Password updated. Please sign in with your new password.",
      });
    }, 900);
  };

  const handleSocialAuth = (provider) => {
    setSuccessMessage(`${provider} authentication demo connected successfully.`);

    setTimeout(() => {
      closeAuthModal();
    }, 800);
  };

  const renderGoogleIcon = () => {
    return (
      <svg
        className="google-svg-icon"
        width="22"
        height="22"
        viewBox="0 0 48 48"
        aria-hidden="true"
      >
        <path
          fill="#FFC107"
          d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.223 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
        />
        <path
          fill="#FF3D00"
          d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
        />
        <path
          fill="#4CAF50"
          d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
        />
        <path
          fill="#1976D2"
          d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
        />
      </svg>
    );
  };

  const renderError = (key) => {
    if (!errors[key]) {
      return null;
    }

    return <p className="auth-field-error">{errors[key]}</p>;
  };

  const renderPasswordField = ({
    id,
    name,
    value,
    placeholder,
    showKey,
    onChange,
  }) => {
    return (
      <div className={`auth-password-wrap ${errors[name] ? "error" : ""}`}>
        <input
          id={id}
          type={showPassword[showKey] ? "text" : "password"}
          name={name}
          value={value}
          placeholder={placeholder}
          autoComplete="new-password"
          onChange={onChange}
        />

        <button
          type="button"
          className="auth-eye-button"
          aria-label={showPassword[showKey] ? "Hide password" : "Show password"}
          onClick={() => togglePassword(showKey)}
        >
          <ion-icon
            name={showPassword[showKey] ? "eye-off-outline" : "eye-outline"}
          ></ion-icon>
        </button>
      </div>
    );
  };

  const renderAuthAlert = () => {
    if (!authMessage.text) {
      return null;
    }

    return (
      <p
        className={`auth-alert ${
          authMessage.type === "success" ? "success" : "error"
        }`}
      >
        {authMessage.text}
      </p>
    );
  };

  const renderRoleCards = (selectedRole, onRoleChange) => {
    return (
      <div className="auth-role-grid">
        <button
          type="button"
          className={`auth-role-card ${
            selectedRole === "seller" ? "active" : ""
          }`}
          onClick={() => onRoleChange("seller")}
        >
          <span className="auth-role-icon">
            <ion-icon name="cart"></ion-icon>
          </span>

          <span className="auth-role-content">
            <strong>Seller</strong>
            <small>Continue as a Seller</small>
          </span>
        </button>

        <button
          type="button"
          className={`auth-role-card ${
            selectedRole === "buyer" ? "active" : ""
          }`}
          onClick={() => onRoleChange("buyer")}
        >
          <span className="auth-role-icon">
            <ion-icon name="bag-handle"></ion-icon>
          </span>

          <span className="auth-role-content">
            <strong>A Buyer</strong>
            <small>Continue as a Buyer</small>
          </span>
        </button>
      </div>
    );
  };

  const renderCountrySelector = () => {
    return (
      <div className="auth-country-select" ref={countryDropdownRef}>
        <button
          type="button"
          className="auth-country-trigger"
          onClick={() => setIsCountryOpen(!isCountryOpen)}
        >
          <span>
            <img src={selectedCountry.flag} alt={selectedCountry.name} />
            {selectedCountry.shortName} {selectedCountry.code}
          </span>

          <ion-icon
            name={isCountryOpen ? "chevron-up-outline" : "chevron-down-outline"}
          ></ion-icon>
        </button>

        <div className={`auth-country-menu ${isCountryOpen ? "show" : ""}`}>
          {countries.map((country) => (
            <button
              key={country.id}
              type="button"
              className={selectedCountry.id === country.id ? "active" : ""}
              onClick={() => handleCountrySelect(country)}
            >
              <span>
                <img src={country.flag} alt={country.name} />
                {country.name}
              </span>

              <strong>{country.code}</strong>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderSocialButtons = () => {
    return (
      <>
        <div className="auth-divider">
          <span></span>
          <p>OR</p>
          <span></span>
        </div>

        <div className="auth-social-list">
          <button
            type="button"
            className="auth-social-button"
            onClick={() => handleSocialAuth("Google")}
          >
            {renderGoogleIcon()}
            Continue with Google
          </button>

          <button
            type="button"
            className="auth-social-button"
            onClick={() => handleSocialAuth("LinkedIn")}
          >
            <span className="linkedin-icon">in</span>
            Continue with LinkedIn
          </button>
        </div>
      </>
    );
  };

  const renderLoginView = () => {
    return (
      <>
        <div className="auth-modal-heading">
          <h2>Sign in as</h2>
        </div>

        {renderRoleCards(loginRole, setLoginRole)}

        <form
          className="auth-form"
          onSubmit={handleLoginSubmit}
          noValidate
          autoComplete="off"
        >
          <div className="auth-field">
            <label htmlFor="login-email">Email / User Name</label>
            <input
              id="login-email"
              className={errors.email ? "error" : ""}
              type="text"
              name="email"
              value={loginData.email}
              placeholder="abc@xyz.com"
              autoComplete="off"
              onChange={handleLoginChange}
            />
            {renderError("email")}
          </div>

          <div className="auth-field">
            <label htmlFor="login-password">Password</label>
            {renderPasswordField({
              id: "login-password",
              name: "password",
              value: loginData.password,
              placeholder: "Enter password",
              showKey: "login",
              onChange: handleLoginChange,
            })}
            {renderError("password")}
          </div>

          <div className="auth-options-row">
            <label className="auth-checkbox">
              <input
                type="checkbox"
                name="remember"
                checked={loginData.remember}
                autoComplete="off"
                onChange={handleLoginChange}
              />
              <span></span>
              Remember me
            </label>

            <button
              type="button"
              className="auth-text-button"
              onClick={() => switchAuthView("forgot")}
            >
              Forgot Password?
            </button>
          </div>

          {renderAuthAlert()}

          <button type="submit" className="auth-submit-button">
            Sign in
          </button>
        </form>

        {renderSocialButtons()}

        <p className="auth-switch-text">
          Don’t have an account?
          <button type="button" onClick={() => switchAuthView("signup")}>
            Sign Up
          </button>
        </p>
      </>
    );
  };

  const renderSignupView = () => {
    return (
      <>
        <div className="auth-modal-heading">
          <h2>Create account</h2>
          <p>Fill up your details and verify your account with demo OTP.</p>
        </div>

        {renderRoleCards(signupRole, setSignupRole)}

        <form
          className="auth-form"
          onSubmit={handleSignupSubmit}
          noValidate
          autoComplete="off"
        >
          <div className="auth-field">
            <label htmlFor="signup-name">Full Name</label>
            <input
              id="signup-name"
              className={errors.fullName ? "error" : ""}
              type="text"
              name="fullName"
              value={signupData.fullName}
              placeholder="Enter your full name"
              autoComplete="off"
              onChange={handleSignupChange}
            />
            {renderError("fullName")}
          </div>

          <div className="auth-field">
            <label htmlFor="signup-email">Email Address</label>
            <input
              id="signup-email"
              className={errors.email ? "error" : ""}
              type="email"
              name="email"
              value={signupData.email}
              placeholder="abc@xyz.com"
              autoComplete="off"
              onChange={handleSignupChange}
            />
            {renderError("email")}
          </div>

          <div className="auth-field">
            <label htmlFor="signup-password">Password</label>
            {renderPasswordField({
              id: "signup-password",
              name: "password",
              value: signupData.password,
              placeholder: "Create password",
              showKey: "signup",
              onChange: handleSignupChange,
            })}
            {renderError("password")}
          </div>

          <div className="auth-field">
            <label htmlFor="signup-phone">Phone Number</label>

            <div className="auth-phone-row">
              {renderCountrySelector()}

              <input
                id="signup-phone"
                className={errors.phone ? "error" : ""}
                type="tel"
                name="phone"
                value={fullSignupPhone}
                placeholder={`${selectedCountry.code} 1700000000`}
                autoComplete="off"
                onChange={handleSignupChange}
              />
            </div>

            {renderError("phone")}
          </div>

          {renderAuthAlert()}

          <button type="submit" className="auth-submit-button">
            Continue
          </button>
        </form>

        {renderSocialButtons()}

        <p className="auth-switch-text">
          Already have an account?
          <button type="button" onClick={() => switchAuthView("login")}>
            Sign In
          </button>
        </p>
      </>
    );
  };

  const renderSignupOtpView = () => {
    return (
      <>
        <div className="auth-modal-heading">
          <h2>Verify signup OTP</h2>
          <p>Enter the 4 digit demo OTP to complete your signup.</p>
        </div>

        <div className="auth-demo-otp">
          <span>Your demo OTP is</span>
          <strong>{demoOtp}</strong>
        </div>

        <form
          className="auth-form"
          onSubmit={handleSignupOtpSubmit}
          noValidate
          autoComplete="off"
        >
          <div className="auth-field">
            <label htmlFor="signup-otp-code">OTP Code</label>
            <input
              id="signup-otp-code"
              className={errors.otp ? "error" : ""}
              type="text"
              value={otpValue}
              maxLength="4"
              placeholder="Enter 4 digit OTP"
              autoComplete="off"
              onChange={(event) => {
                const value = event.target.value
                  .replace(/\D/g, "")
                  .slice(0, 4);

                setOtpValue(value);
                setErrors((prev) => ({
                  ...prev,
                  otp: "",
                }));
                setAuthMessage({
                  type: "",
                  text: "",
                });
              }}
            />
            {renderError("otp")}
          </div>

          {renderAuthAlert()}

          <button type="submit" className="auth-submit-button">
            Verify & Sign Up
          </button>
        </form>

        <div className="auth-otp-actions">
          <button type="button" onClick={handleResendSignupOtp}>
            Resend OTP
          </button>

          <button type="button" onClick={() => switchAuthView("signup")}>
            Edit Details
          </button>
        </div>
      </>
    );
  };

  const renderForgotView = () => {
    return (
      <>
        <div className="auth-modal-heading">
          <h2>Reset password</h2>
          <p>Enter your email and create a new password for your account.</p>
        </div>

        <form
          className="auth-form"
          onSubmit={handleForgotSubmit}
          noValidate
          autoComplete="off"
        >
          <div className="auth-field">
            <label htmlFor="forgot-email">Email Address</label>
            <input
              id="forgot-email"
              className={errors.email ? "error" : ""}
              type="email"
              name="email"
              value={forgotData.email}
              placeholder="abc@xyz.com"
              autoComplete="off"
              onChange={handleForgotChange}
            />
            {renderError("email")}
          </div>

          <div className="auth-field">
            <label htmlFor="forgot-password">New Password</label>
            {renderPasswordField({
              id: "forgot-password",
              name: "password",
              value: forgotData.password,
              placeholder: "New password",
              showKey: "forgotNew",
              onChange: handleForgotChange,
            })}
            {renderError("password")}
          </div>

          <div className="auth-field">
            <label htmlFor="forgot-confirm-password">Confirm Password</label>
            {renderPasswordField({
              id: "forgot-confirm-password",
              name: "confirmPassword",
              value: forgotData.confirmPassword,
              placeholder: "Confirm password",
              showKey: "forgotConfirm",
              onChange: handleForgotChange,
            })}
            {renderError("confirmPassword")}
          </div>

          {renderAuthAlert()}

          <button type="submit" className="auth-submit-button">
            Update Password
          </button>
        </form>

        <p className="auth-switch-text">
          Back to
          <button type="button" onClick={() => switchAuthView("login")}>
            Sign In
          </button>
        </p>
      </>
    );
  };

  const renderAuthContent = () => {
    if (authView === "signup") {
      return renderSignupView();
    }

    if (authView === "signupOtp") {
      return renderSignupOtpView();
    }

    if (authView === "forgot") {
      return renderForgotView();
    }

    return renderLoginView();
  };

  return (
    <>
      <header className="templaraa-header">
        <div className="header-top">
          <div className="container-fluid header-container">
            <div className="header-top-inner">
              <a href="/" className="header-brand" aria-label="Templaraa Home">
                <img src={logo} alt="Templaraa Logo" className="brand-logo" />
              </a>

              <nav
                className="header-nav desktop-nav"
                onMouseLeave={() => setHoveredNav(null)}
              >
                {mainNavLinks.map((item) => (
                  <a
                    key={item.id}
                    href={item.path}
                    className={getNavClassName(item.id)}
                    onMouseEnter={() => setHoveredNav(item.id)}
                    onClick={(event) => handleNavClick(event, item)}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>

              <div className="header-actions">
                <div className="header-search">
                  <ion-icon name="search-outline"></ion-icon>
                  <input
                    type="text"
                    value={searchValue}
                    placeholder="Search products"
                    onChange={handleSearchChange}
                  />
                </div>

                <button
                  className="cart-button"
                  type="button"
                  aria-label="Open cart"
                  onClick={handleCartClick}
                >
                  <ion-icon name="bag-handle-outline"></ion-icon>
                  <span>{cartCount}</span>
                </button>

                <button
                  type="button"
                  className="signin-button"
                  onClick={() => openAuthModal("login")}
                >
                  <ion-icon name="person-outline"></ion-icon>
                  <span>Sign In</span>
                </button>

                <button
                  className="menu-toggle"
                  type="button"
                  aria-label="Open main menu"
                  onClick={() => setIsTopMenuOpen(true)}
                >
                  <ion-icon name="menu-outline"></ion-icon>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="header-category">
          <div className="container-fluid header-container">
            <div className="category-mobile-row">
              <button
                className="category-toggle"
                type="button"
                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
              >
                <ion-icon
                  name={isCategoryMenuOpen ? "close-outline" : "menu-outline"}
                ></ion-icon>
                <span>{activeCategory}</span>
              </button>

              <a href="/seller" className="seller-button mobile-seller">
                Become a Seller
              </a>
            </div>

            <div className={`category-inner ${isCategoryMenuOpen ? "show" : ""}`}>
              <a href="/seller" className="seller-button desktop-seller">
                Become a Seller
              </a>

              <span className="category-divider"></span>

              <div
                className="category-list"
                onMouseLeave={() => setHoveredCategory(null)}
              >
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className={getCategoryClassName(category)}
                    onMouseEnter={() => setHoveredCategory(category)}
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div
        className={`drawer-overlay ${isTopMenuOpen ? "show" : ""}`}
        onClick={closeDrawer}
      ></div>

      <aside className={`mobile-drawer ${isTopMenuOpen ? "show" : ""}`}>
        <div className="drawer-header">
          <img src={logo} alt="Templaraa Logo" className="drawer-logo" />

          <button
            type="button"
            className="drawer-close"
            aria-label="Close menu"
            onClick={closeDrawer}
          >
            <ion-icon name="close-outline"></ion-icon>
          </button>
        </div>

        <div className="drawer-search">
          <ion-icon name="search-outline"></ion-icon>
          <input
            type="text"
            value={searchValue}
            placeholder="Search products"
            onChange={handleSearchChange}
          />
        </div>

        <nav className="drawer-nav" onMouseLeave={() => setHoveredNav(null)}>
          {mainNavLinks.map((item) => (
            <a
              key={item.id}
              href={item.path}
              className={getNavClassName(item.id)}
              onMouseEnter={() => setHoveredNav(item.id)}
              onClick={(event) => handleNavClick(event, item)}
            >
              {item.label}
              <ion-icon name="chevron-forward-outline"></ion-icon>
            </a>
          ))}
        </nav>

        <div className="drawer-auth-actions">
          <button type="button" onClick={() => openAuthModal("login")}>
            <ion-icon name="person-outline"></ion-icon>
            Sign In
          </button>

          <button type="button" onClick={() => openAuthModal("signup")}>
            <ion-icon name="person-add-outline"></ion-icon>
            Sign Up
          </button>
        </div>
      </aside>

      {isAuthOpen && (
        <div className="auth-modal-overlay">
          <div className="auth-modal-card">
            <button
              type="button"
              className="auth-modal-close"
              aria-label="Close auth popup"
              onClick={closeAuthModal}
            >
              <ion-icon name="close-outline"></ion-icon>
            </button>

            {renderAuthContent()}
          </div>
        </div>
      )}
    </>
  );
}

export default Header;