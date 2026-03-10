"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  PencilIcon,
  CameraIcon,
  CheckCircleIcon,
  XMarkIcon,
  ArrowLeftIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  BookOpenIcon,
  ShoppingBagIcon,
  HeartIcon,
  CreditCardIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";
import { FaGithub, FaTwitter, FaLinkedin, FaFacebook } from "react-icons/fa";

import useAuth from "@/Hooks/UseAuth";
import useAxiosSecure from "@/Hooks/UseAxiosSecure";
import Loading from "@/app/Loading";

const MyProfile = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  // Fetch user role
  const { data: userRole = "user", isLoading: roleLoading } = useQuery({
    queryKey: ["user-role", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}/role`);
      return res.data.role;
    },
  });

  // Fetch user profile data
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ["user-profile", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data;
    },
  });

  // Fetch user stats (orders, wishlist, payments)
  const { data: userStats = { orders: 0, wishlist: 0, payments: 0 } } =
    useQuery({
      queryKey: ["user-stats", user?.email],
      enabled: !!user?.email,
      queryFn: async () => {
        const [ordersRes, wishlistRes, paymentsRes] = await Promise.all([
          axiosSecure.get(`/orders?email=${user.email}`),
          axiosSecure.get(`/wishlist/${user.email}`),
          axiosSecure.get(`/payments?customerEmail=${user.email}`),
        ]);

        return {
          orders: ordersRes.data.length,
          wishlist: wishlistRes.data.length,
          payments: paymentsRes.data.length,
          totalSpent: paymentsRes.data.reduce(
            (sum, p) => sum + (p.amount || 0),
            0,
          ),
        };
      },
    });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (updatedData) => {
      const res = await axiosSecure.patch(
        `/users/profile/${user.email}`,
        updatedData,
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-profile", user?.email],
      });
      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: "Your profile has been successfully updated.",
        timer: 2000,
        showConfirmButton: false,
        background: "var(--color-base-100)",
        color: "var(--color-base-content)",
      });
      setIsEditing(false);
      setPreviewImage(null);
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.response?.data?.error || "Something went wrong",
        background: "var(--color-base-100)",
        color: "var(--color-base-content)",
      });
    },
  });

  // Initialize form data when profile loads
  useEffect(() => {
    if (profileData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: user?.displayName || profileData.name || "",
        email: profileData.email || user?.email || "",
        phone: profileData.phone || "",
        address: profileData.address || "",
        bio: profileData.bio || "",
        website: profileData.website || "",
        location: profileData.location || "",
        photoURL:
          profileData.photoURL || user?.photoURL || "/default-avatar.png",
        social: {
          github: profileData.social?.github || "",
          twitter: profileData.social?.twitter || "",
          linkedin: profileData.social?.linkedin || "",
          facebook: profileData.social?.facebook || "",
        },
        preferences: profileData.preferences || {
          emailNotifications: true,
        },
        createdAt: profileData.createdAt,
      });
    }
  }, [profileData, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Update preview for photoURL
    if (name === "photoURL") {
      setPreviewImage(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPreviewImage(null);
    // Reset form data to original profile data
    if (profileData) {
      setFormData({
        name: profileData.name || user?.displayName || "",
        email: profileData.email || user?.email || "",
        phone: profileData.phone || "",
        address: profileData.address || "",
        bio: profileData.bio || "",
        website: profileData.website || "",
        location: profileData.location || "",
        photoURL:
          profileData.photoURL || user?.photoURL || "/default-avatar.png",
        social: {
          github: profileData.social?.github || "",
          twitter: profileData.social?.twitter || "",
          linkedin: profileData.social?.linkedin || "",
          facebook: profileData.social?.facebook || "",
        },
        preferences: profileData.preferences || {
          emailNotifications: true,
        },
        createdAt: profileData.createdAt,
      });
    }
  };

  // Get role badge color
  const getRoleBadgeColor = () => {
    switch (userRole) {
      case "admin":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      case "librarian":
        return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20";
      default:
        return "bg-primary/10 text-primary border-primary/20";
    }
  };

  // Get role icon
  const getRoleIcon = () => {
    switch (userRole) {
      case "admin":
        return <ShieldCheckIcon className="w-4 h-4" />;
      case "librarian":
        return <BookOpenIcon className="w-4 h-4" />;
      default:
        return <UserIcon className="w-4 h-4" />;
    }
  };

  if (authLoading || profileLoading || roleLoading) return <Loading />;

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-center bg-base-200">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-base-100 rounded-2xl p-8 shadow-xl max-w-md"
        >
          <UserIcon className="w-20 h-20 text-base-content/30 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2 text-base-content">
            Not Logged In
          </h2>
          <p className="text-base-content/70 mb-6">
            Please log in to view your profile
          </p>
          <button
            onClick={() => router.push("/login")}
            className="btn btn-primary w-full"
          >
            Go to Login
          </button>
        </motion.div>
      </div>
    );
  }

  console.log(formData)
  console.log(user.displayName)

  return (
    <div className="min-h-screen bg-base-200 py-8 sm:py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 text-base-content/60 hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </motion.button>

        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-base-100 rounded-2xl shadow-xl overflow-hidden border border-base-300 mb-6"
        >
          {/* Cover Photo */}
          <div className="h-32 bg-linear-to-r from-primary/20 to-accent/20 relative">
            <div className="absolute inset-0 bg-linear-to-t from-base-100/50 to-transparent"></div>
          </div>

          {/* Profile Header Content */}
          <div className="px-6 pb-6 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-16 mb-4">
              {/* Avatar with Preview */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-full bg-linear-to-br from-primary to-accent p-1 shadow-xl">
                  <Image
                    src={
                      previewImage || formData.photoURL || "/default-avatar.png"
                    }
                    alt="Profile Avatar"
                    width={128}
                    height={128}
                    className="rounded-full object-cover bg-base-100 w-full h-full"
                    onError={(e) => {
                      e.target.src = "/default-avatar.png";
                    }}
                  />
                </div>

                {/* Edit indicator when in edit mode */}
                {isEditing && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-primary text-white text-xs px-2 py-1 rounded-full whitespace-nowrap">
                    <LinkIcon className="w-3 h-3 inline mr-1" />
                    URL editable
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-bold playfair text-base-content">
                    {formData.name}
                  </h1>

                  {/* Role Badge */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor()} flex items-center gap-1`}
                  >
                    {getRoleIcon()}
                    <span className="capitalize">{userRole}</span>
                  </span>
                </div>

                <p className="text-base-content/70 flex items-center gap-2">
                  <EnvelopeIcon className="w-4 h-4" />
                  {formData.email}
                </p>
              </div>

              {/* Edit Button */}
              <button
                onClick={() =>
                  isEditing ? handleCancel() : setIsEditing(true)
                }
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  isEditing
                    ? "bg-base-300 text-base-content hover:bg-base-300/80"
                    : "bg-primary text-white hover:bg-primary/90"
                }`}
              >
                {isEditing ? (
                  <>
                    <XMarkIcon className="w-4 h-4" />
                    Cancel
                  </>
                ) : (
                  <>
                    <PencilIcon className="w-4 h-4" />
                    Edit Profile
                  </>
                )}
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              <div className="bg-base-200/50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-primary mb-1">
                  <ShoppingBagIcon className="w-4 h-4" />
                  <span className="text-xs text-base-content/60">Orders</span>
                </div>
                <p className="text-xl font-bold text-base-content">
                  {userStats.orders}
                </p>
              </div>

              <div className="bg-base-200/50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-accent mb-1">
                  <HeartIcon className="w-4 h-4" />
                  <span className="text-xs text-base-content/60">Wishlist</span>
                </div>
                <p className="text-xl font-bold text-base-content">
                  {userStats.wishlist}
                </p>
              </div>

              <div className="bg-base-200/50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-success mb-1">
                  <CreditCardIcon className="w-4 h-4" />
                  <span className="text-xs text-base-content/60">Payments</span>
                </div>
                <p className="text-xl font-bold text-base-content">
                  {userStats.payments}
                </p>
              </div>

              <div className="bg-base-200/50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-info mb-1">
                  <CalendarIcon className="w-4 h-4" />
                  <span className="text-xs text-base-content/60">Joined</span>
                </div>
                <p className="text-sm font-bold text-base-content">
                  {formData.createdAt
                    ? new Date(formData.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Profile Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-base-100 rounded-2xl shadow-xl border border-base-300 overflow-hidden"
        >
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-base-content flex items-center gap-2 border-b border-base-300 pb-2">
                    <UserIcon className="w-5 h-5 text-primary" />
                    Personal Information
                  </h3>

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-base-content/70 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ""}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 bg-base-200 border border-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed"
                      required
                    />
                  </div>

                  {/* Email (read-only) */}
                  <div>
                    <label className="block text-sm font-medium text-base-content/70 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email || ""}
                      disabled
                      className="w-full px-4 py-2 bg-base-200 border border-base-300 rounded-lg opacity-60 cursor-not-allowed"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-base-content/70 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="+880 1XXXXXXXXX"
                        className="w-full pl-10 pr-4 py-2 bg-base-200 border border-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-base-content/70 mb-1">
                      Location
                    </label>
                    <div className="relative">
                      <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
                      <input
                        type="text"
                        name="location"
                        value={formData.location || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="City, Country"
                        className="w-full pl-10 pr-4 py-2 bg-base-200 border border-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-base-content/70 mb-1">
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address || ""}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows="2"
                      placeholder="Your full address"
                      className="w-full px-4 py-2 bg-base-200 border border-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed resize-none"
                    />
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-base-content/70 mb-1">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio || ""}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows="3"
                      placeholder="Tell us a little about yourself..."
                      className="w-full px-4 py-2 bg-base-200 border border-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed resize-none"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-base-content flex items-center gap-2 border-b border-base-300 pb-2">
                    <GlobeAltIcon className="w-5 h-5 text-primary" />
                    Social & Preferences
                  </h3>

                  {/* Photo URL - New Field */}
                  <div>
                    <label className="block text-sm font-medium text-base-content/70 mb-1">
                      Profile Photo URL
                    </label>
                    <div className="relative">
                      <CameraIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
                      <input
                        type="url"
                        name="photoURL"
                        value={formData.photoURL || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="https://example.com/your-photo.jpg"
                        className="w-full pl-10 pr-4 py-2 bg-base-200 border border-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>
                    <p className="text-xs text-base-content/40 mt-1">
                      Enter a direct link to your profile picture (JPG, PNG,
                      GIF)
                    </p>
                  </div>

                  {/* Website */}
                  <div>
                    <label className="block text-sm font-medium text-base-content/70 mb-1">
                      Website
                    </label>
                    <div className="relative">
                      <GlobeAltIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
                      <input
                        type="url"
                        name="website"
                        value={formData.website || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="https://yourwebsite.com"
                        className="w-full pl-10 pr-4 py-2 bg-base-200 border border-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-base-content/70">
                      Social Profiles
                    </label>

                    {/* GitHub */}
                    <div className="relative">
                      <FaGithub className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
                      <input
                        type="text"
                        name="social.github"
                        value={formData.social?.github || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="GitHub username"
                        className="w-full pl-10 pr-4 py-2 bg-base-200 border border-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>

                    {/* Twitter */}
                    <div className="relative">
                      <FaTwitter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
                      <input
                        type="text"
                        name="social.twitter"
                        value={formData.social?.twitter || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="Twitter handle"
                        className="w-full pl-10 pr-4 py-2 bg-base-200 border border-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>

                    {/* LinkedIn */}
                    <div className="relative">
                      <FaLinkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
                      <input
                        type="text"
                        name="social.linkedin"
                        value={formData.social?.linkedin || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="LinkedIn profile URL"
                        className="w-full pl-10 pr-4 py-2 bg-base-200 border border-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>

                    {/* Facebook */}
                    <div className="relative">
                      <FaFacebook className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
                      <input
                        type="text"
                        name="social.facebook"
                        value={formData.social?.facebook || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="Facebook profile URL"
                        className="w-full pl-10 pr-4 py-2 bg-base-200 border border-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Preferences */}
                  <div>
                    <h4 className="text-sm font-medium text-base-content/70 mb-2">
                      Preferences
                    </h4>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="preferences.emailNotifications"
                        checked={
                          formData.preferences?.emailNotifications || false
                        }
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              emailNotifications: e.target.checked,
                            },
                          }));
                        }}
                        disabled={!isEditing}
                        className="checkbox checkbox-primary checkbox-sm"
                      />
                      <span className="text-sm text-base-content/80">
                        Receive email notifications
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Save Button (only show when editing) */}
              {isEditing && (
                <div className="mt-6 pt-6 border-t border-base-300 flex justify-end">
                  <button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {updateProfileMutation.isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircleIcon className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MyProfile;
