"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import useAxiosSecure from "@/hooks/UseAxiosSecure";
import Swal from "sweetalert2";
import Loading from "@/app/Loading";
import { 
  Users, 
  User, 
  Mail, 
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Crown
} from "lucide-react";

const AllUsers = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [expandedUser, setExpandedUser] = useState(null);

  // Fetch users
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  // Change role mutation
  const roleMutation = useMutation({
    mutationFn: async ({ id, role }) => {
      return axiosSecure.patch(`/users/role/${id}`, { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      Swal.fire({
        icon: "success",
        title: "Role Updated",
        text: "User role has been changed successfully.",
        background: "#FAFAFA",
        confirmButtonColor: "#4CAF50",
        iconColor: "#4CAF50",
        timer: 2000,
        timerProgressBar: true,
      });
    },
  });

  const handleRoleChange = (user, role) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to make ${user.displayName || 'this user'} a ${role}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4CAF50",
      cancelButtonColor: "#EF4444",
      confirmButtonText: `Yes, make ${role}`,
      background: "#FAFAFA",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        roleMutation.mutate({ id: user._id, role });
      }
    });
  };

  // Filter users based on search
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  // Calculate statistics
  const totalUsers = users.length;
  const adminCount = users.filter(u => u.role === "admin").length;
  const librarianCount = users.filter(u => u.role === "librarian").length;
  const regularUsers = users.filter(u => !u.role || u.role === "user").length;

  const getRoleIcon = (role) => {
    switch(role) {
      case "admin": return <Crown className="w-4 h-4" />;
      case "librarian": return <BookOpen className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getRoleBadgeClass = (role) => {
    switch(role) {
      case "admin": 
        return "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800";
      case "librarian": 
        return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800";
      default: 
        return "bg-base-200 text-base-content/70 border-base-300";
    }
  };

  const toggleUserExpand = (userId) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4 sm:px-6 lg:px-8 inter">
      <div className="max-w-7xl mx-auto">
        {/* Simple Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-0.5 bg-primary/30"></div>
            <Users className="w-6 h-6 text-primary" />
            <div className="w-12 h-0.5 bg-primary/30"></div>
          </div>
          
          <h2 className="text-4xl md:text-5xl playfair font-bold mb-3">
            <span className="text-base-content">User</span>{' '}
            <span className="text-primary">Management</span>
          </h2>
        </div>

        {/* Simple Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-base-100 rounded-2xl p-6 shadow-lg border border-base-300/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/60">Total Users</p>
                <p className="text-3xl font-bold text-primary">{totalUsers}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-base-100 rounded-2xl p-6 shadow-lg border border-base-300/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/60">Admins</p>
                <p className="text-3xl font-bold text-purple-600">{adminCount}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Crown className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-base-100 rounded-2xl p-6 shadow-lg border border-base-300/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/60">Librarians</p>
                <p className="text-3xl font-bold text-blue-600">{librarianCount}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-base-100 rounded-2xl p-6 shadow-lg border border-base-300/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/60">Regular Users</p>
                <p className="text-3xl font-bold text-base-content">{regularUsers}</p>
              </div>
              <div className="w-12 h-12 bg-base-300 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-base-content/70" />
              </div>
            </div>
          </div>
        </div>

        {/* Simple Search and Filter Bar */}
        <div className="bg-base-100 rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name or email..."
                className="w-full pl-10 pr-4 py-3 bg-base-200 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40 w-4 h-4" />
              <select
                className="pl-10 pr-8 py-3 bg-base-200 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary appearance-none cursor-pointer"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="user">Regular Users</option>
                <option value="librarian">Librarians</option>
                <option value="admin">Admins</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users List */}
        {filteredUsers.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-base-100 rounded-3xl p-12 shadow-xl max-w-md mx-auto">
              <Users className="w-16 h-16 text-primary/30 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-base-content mb-2">No Users Found</h3>
              <p className="text-base-content/60">No users match your current filters.</p>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-base-100 rounded-2xl shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-base-200">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-base-content/80">#</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-base-content/80">User</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-base-content/80">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-base-content/80">Role</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-base-content/80">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-base-200">
                    {filteredUsers.map((user, index) => (
                      <React.Fragment key={user._id}>
                        <tr className="hover:bg-base-200/50 transition-colors duration-200">
                          <td className="px-6 py-4 text-sm text-base-content/60">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-semibold text-base-content">
                                  {user.displayName || "No Name"}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-base-content/70">
                              <Mail className="w-4 h-4" />
                              <span>{user.email}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getRoleBadgeClass(user.role)}`}>
                              {getRoleIcon(user.role)}
                              <span className="capitalize">{user.role || "user"}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleUserExpand(user._id)}
                                className="p-2 bg-base-200 text-base-content/70 rounded-lg hover:bg-primary hover:text-white transition-all duration-200"
                                title="View Details"
                              >
                                {expandedUser === user._id ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </button>
                              
                              {user.role !== "admin" && (
                                <button
                                  className={`p-2 rounded-lg transition-all duration-200 ${
                                    user.role === "librarian" 
                                      ? "bg-blue-100 text-blue-700 hover:bg-blue-600 hover:text-white" 
                                      : "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white"
                                  }`}
                                  onClick={() => handleRoleChange(user, "librarian")}
                                  title="Make Librarian"
                                  disabled={user.role === "librarian"}
                                >
                                  <BookOpen className="w-4 h-4" />
                                </button>
                              )}
                              
                              {user.role !== "admin" && user.role !== "librarian" && (
                                <button
                                  className="p-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-600 hover:text-white transition-all duration-200"
                                  onClick={() => handleRoleChange(user, "admin")}
                                  title="Make Admin"
                                >
                                  <Crown className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                        {/* Simple Expanded Details Row */}
                        {expandedUser === user._id && (
                          <tr className="bg-base-200/50">
                            <td colSpan="5" className="px-6 py-4">
                              <div className="space-y-2">
                                <p className="text-sm">
                                  <span className="font-medium">User ID:</span> {user._id}
                                </p>
                                <p className="text-sm">
                                  <span className="font-medium">Display Name:</span> {user.displayName || 'N/A'}
                                </p>
                                <p className="text-sm">
                                  <span className="font-medium">Email:</span> {user.email}
                                </p>
                                <p className="text-sm">
                                  <span className="font-medium">Current Role:</span>{' '}
                                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeClass(user.role)}`}>
                                    {getRoleIcon(user.role)}
                                    <span className="capitalize">{user.role || "user"}</span>
                                  </span>
                                </p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Simple Mobile Cards */}
            <div className="md:hidden space-y-4">
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="bg-base-100 rounded-2xl shadow-lg overflow-hidden border border-base-200"
                >
                  {/* Card Header */}
                  <div 
                    className="p-4 cursor-pointer"
                    onClick={() => toggleUserExpand(user._id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base-content truncate">
                          {user.displayName || "No Name"}
                        </h3>
                        <p className="text-sm text-base-content/60 truncate">
                          {user.email}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getRoleBadgeClass(user.role)}`}>
                          {getRoleIcon(user.role)}
                          <span className="capitalize">{user.role || "user"}</span>
                        </span>
                        {expandedUser === user._id ? (
                          <ChevronUp className="w-5 h-5 text-base-content/40" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-base-content/40" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Simple Expanded Content */}
                  {expandedUser === user._id && (
                    <div className="px-4 pb-4 pt-2 border-t border-base-200">
                      <div className="space-y-2 mb-4">
                        <p className="text-sm">
                          <span className="font-medium">User ID:</span> {user._id}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Email:</span> {user.email}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        {user.role !== "admin" && (
                          <button
                            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                              user.role === "librarian" 
                                ? "bg-blue-100 text-blue-700" 
                                : "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white"
                            }`}
                            onClick={() => handleRoleChange(user, "librarian")}
                            disabled={user.role === "librarian"}
                          >
                            <BookOpen className="w-4 h-4" />
                            Librarian
                          </button>
                        )}
                        
                        {user.role !== "admin" && user.role !== "librarian" && (
                          <button
                            className="flex-1 py-2 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-600 hover:text-white transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2"
                            onClick={() => handleRoleChange(user, "admin")}
                          >
                            <Crown className="w-4 h-4" />
                            Admin
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Simple Summary */}
        {filteredUsers.length > 0 && (
          <div className="mt-4 text-center text-sm text-base-content/60">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUsers;