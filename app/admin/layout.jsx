"use client";

import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";
import AdminWrapper from "@/components/admin/adminWrapper";
const AdminLayout = ({ children }) => {
  return <AdminWrapper>{children} </AdminWrapper>;
};

export default AdminLayout;
