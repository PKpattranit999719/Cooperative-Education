
import React from "react";
import * as AiIcons from "react-icons/ai";
import { BsFileEarmarkBarGraphFill } from "react-icons/bs";
import { AiFillCalculator } from "react-icons/ai";

export const SidebarData = [
  {
    title: "Home",
    path: "/homestudent",
    icon: <AiIcons.AiFillHome />,
    cName: "nav-text",
  },
  {
    title: "Lesson",
    path: "/lessonstudent",
    icon: <AiIcons.AiOutlineBook />,
    cName: "nav-text",
  },
  {
    title: "Quiz",
    path: "/lessonQuiz",
    icon: <AiFillCalculator />,
    cName: "nav-text",
  },
  {
    title: "Dashbord",
    path: "/dashboard",
    icon: <BsFileEarmarkBarGraphFill />,
    cName: "nav-text",
    sendId: true, // เพิ่มเพื่อบ่งบอกว่าต้องส่ง id
  },
];
