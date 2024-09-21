import React from "react";
import * as AiIcons from "react-icons/ai";
import { AiFillCalculator } from "react-icons/ai";
import { BsFileEarmarkBarGraphFill } from "react-icons/bs";

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
    title: "Quize",
    path: "/quizestudent",
    icon: <AiFillCalculator />,
    cName: "nav-text",
  },
  {
    title: "Dashbord",
    path: "/quizestudent",
    icon: <BsFileEarmarkBarGraphFill />,
    cName: "nav-text",
  },
];
