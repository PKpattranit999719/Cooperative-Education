import React from "react";
import * as AiIcons from "react-icons/ai";
import * as FaIcons from "react-icons/fa";
import * as IoIcons from "react-icons/io";
import { FaCloudUploadAlt } from "react-icons/fa";
import { BsFileEarmarkBarGraphFill } from "react-icons/bs";

export const SidebarData = [
  {
    title: "Home",
    path: "/",
    icon: <AiIcons.AiFillHome />,
    cName: "nav-text",
  },
  {
    title: "History",
    path: "/history",
    icon: <IoIcons.IoIosTime />,
    cName: "nav-text",
  },
  {
    title: "Lesson",
    path: "/lesson",
    icon: <AiIcons.AiOutlineBook />,
    cName: "nav-text",
  },
  {
    title: "Class",
    path: "/class",
    icon: <FaIcons.FaChalkboardTeacher />,
    cName: "nav-text",
  },
  {
    title: "Upload",
    path: "/upload",
    icon: <FaCloudUploadAlt />,
    cName: "nav-text",
  },
];
