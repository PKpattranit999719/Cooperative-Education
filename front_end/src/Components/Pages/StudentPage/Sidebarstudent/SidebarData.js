import React from "react";
import * as AiIcons from "react-icons/ai";
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
    title: "Quize",
    path: "/quizestudent",
    icon: <AiFillCalculator />,
    cName: "nav-text",
  },
];
