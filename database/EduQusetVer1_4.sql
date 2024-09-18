-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Sep 18, 2024 at 10:18 AM
-- Server version: 9.0.1
-- PHP Version: 8.2.23

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `EduQusetVer1.3`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `ID` int NOT NULL,
  `name` text NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`ID`, `name`, `email`, `password`) VALUES
(1, 'feel', '3', '$2b$12$1IH97d0EckeP55hsw280JuJ9yEiD3XEJhb4cUw/Zd6bL.oKty0/eO'),
(2, 'feel', 'pop', '$2b$12$NxdNumNWbNtLPibHzi/Ec.Rm1SzirBT431wNC903dK4XZsvU5AagO');

-- --------------------------------------------------------

--
-- Table structure for table `choice`
--

CREATE TABLE `choice` (
  `ID` int NOT NULL,
  `ID_Question` int NOT NULL,
  `Choice_Text` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Is_Correct` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `choice`
--

INSERT INTO `choice` (`ID`, `ID_Question`, `Choice_Text`, `Is_Correct`) VALUES
(1, 2, '1', 1),
(2, 2, '4', 0),
(3, 2, '3', 0),
(4, 2, '2', 0),
(9, 4, '0', 1),
(10, 4, '3', 0),
(11, 4, '5', 0),
(12, 4, '7', 0),
(13, 5, '4', 1),
(14, 5, '3', 0),
(15, 5, '5', 0),
(16, 5, '7', 0),
(17, 6, '2', 1),
(18, 6, '3', 0),
(19, 6, '5', 0),
(20, 6, '7', 0);

-- --------------------------------------------------------

--
-- Table structure for table `lesson`
--

CREATE TABLE `lesson` (
  `ID_Lesson` int NOT NULL,
  `name_lesson` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `lesson`
--

INSERT INTO `lesson` (`ID_Lesson`, `name_lesson`) VALUES
(1, 'การลบ');

-- --------------------------------------------------------

--
-- Table structure for table `question`
--

CREATE TABLE `question` (
  `ID_Question` int NOT NULL,
  `QuestionText` text NOT NULL,
  `Lesson` int NOT NULL,
  `Answer` text NOT NULL,
  `RoomID` int NOT NULL,
  `Question_set` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `question`
--

INSERT INTO `question` (`ID_Question`, `QuestionText`, `Lesson`, `Answer`, `RoomID`, `Question_set`) VALUES
(2, '3-2', 1, '1', 3, 1),
(4, '1-1', 1, '0', 3, 1),
(5, '5-1', 1, '0', 3, 1),
(6, '11-9', 1, '0', 3, 1);

-- --------------------------------------------------------

--
-- Table structure for table `room`
--

CREATE TABLE `room` (
  `ID_Room` int NOT NULL,
  `Owner_admin` int NOT NULL,
  `name` varchar(50) NOT NULL,
  `key` varchar(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `room`
--

INSERT INTO `room` (`ID_Room`, `Owner_admin`, `name`, `key`) VALUES
(1, 1, '', ''),
(2, 2, 'haha', 'I92D'),
(3, 2, 'huhu', 'ZHJD');

-- --------------------------------------------------------

--
-- Table structure for table `scoreHistory`
--

CREATE TABLE `scoreHistory` (
  `ID_ScoreHistory` int NOT NULL,
  `Score` int NOT NULL,
  `total_question` int NOT NULL,
  `Date` date NOT NULL,
  `UserID` int NOT NULL,
  `Lesson` int NOT NULL,
  `Question_set` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `scoreHistory`
--

INSERT INTO `scoreHistory` (`ID_ScoreHistory`, `Score`, `total_question`, `Date`, `UserID`, `Lesson`, `Question_set`) VALUES
(5, 4, 4, '2024-09-16', 1, 1, 1),
(7, 1, 4, '2018-07-27', 1, 1, 2);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `ID` int NOT NULL,
  `name` text NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `RoomID` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`ID`, `name`, `email`, `password`, `RoomID`) VALUES
(1, 'feel', 'ku', '$2b$12$1IH97d0EckeP55hsw280JuJ9yEiD3XEJhb4cUw/Zd6bL.oKty0/eO', 3),
(3, 'paper', 'cat', '$2b$12$RdKe/ZxU9N2vCfXOd/a/Tus513Xcy5VJn66CPVW4CAnhpfTmxyM1.', 3);

-- --------------------------------------------------------

--
-- Table structure for table `UserAns`
--

CREATE TABLE `UserAns` (
  `ID` int NOT NULL,
  `ID_SocreHistory` int NOT NULL,
  `ID_Choice` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `UserAns`
--

INSERT INTO `UserAns` (`ID`, `ID_SocreHistory`, `ID_Choice`) VALUES
(3, 5, 1),
(5, 5, 9),
(6, 5, 13),
(7, 5, 17),
(8, 7, 1),
(10, 7, 9),
(11, 7, 13),
(12, 7, 20);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `choice`
--
ALTER TABLE `choice`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ID_Question` (`ID_Question`);

--
-- Indexes for table `lesson`
--
ALTER TABLE `lesson`
  ADD PRIMARY KEY (`ID_Lesson`);

--
-- Indexes for table `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`ID_Question`),
  ADD KEY `Lesson` (`Lesson`),
  ADD KEY `RoomID` (`RoomID`);

--
-- Indexes for table `room`
--
ALTER TABLE `room`
  ADD PRIMARY KEY (`ID_Room`),
  ADD KEY `Owner_admin` (`Owner_admin`);

--
-- Indexes for table `scoreHistory`
--
ALTER TABLE `scoreHistory`
  ADD PRIMARY KEY (`ID_ScoreHistory`),
  ADD KEY `UserID` (`UserID`),
  ADD KEY `Lesson` (`Lesson`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `RoomID` (`RoomID`);

--
-- Indexes for table `UserAns`
--
ALTER TABLE `UserAns`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ID_SocreHistory` (`ID_SocreHistory`),
  ADD KEY `ID_Choce` (`ID_Choice`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `choice`
--
ALTER TABLE `choice`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `lesson`
--
ALTER TABLE `lesson`
  MODIFY `ID_Lesson` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `question`
--
ALTER TABLE `question`
  MODIFY `ID_Question` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `room`
--
ALTER TABLE `room`
  MODIFY `ID_Room` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `scoreHistory`
--
ALTER TABLE `scoreHistory`
  MODIFY `ID_ScoreHistory` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `UserAns`
--
ALTER TABLE `UserAns`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `choice`
--
ALTER TABLE `choice`
  ADD CONSTRAINT `1` FOREIGN KEY (`ID_Question`) REFERENCES `question` (`ID_Question`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `question`
--
ALTER TABLE `question`
  ADD CONSTRAINT `question_ibfk_1` FOREIGN KEY (`Lesson`) REFERENCES `lesson` (`ID_Lesson`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `question_ibfk_2` FOREIGN KEY (`RoomID`) REFERENCES `room` (`ID_Room`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `room`
--
ALTER TABLE `room`
  ADD CONSTRAINT `room_ibfk_1` FOREIGN KEY (`Owner_admin`) REFERENCES `admin` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `scoreHistory`
--
ALTER TABLE `scoreHistory`
  ADD CONSTRAINT `scorehistory_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `user` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `scorehistory_ibfk_2` FOREIGN KEY (`Lesson`) REFERENCES `lesson` (`ID_Lesson`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`RoomID`) REFERENCES `room` (`ID_Room`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `UserAns`
--
ALTER TABLE `UserAns`
  ADD CONSTRAINT `choce_1` FOREIGN KEY (`ID_Choice`) REFERENCES `choice` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `choce_2` FOREIGN KEY (`ID_SocreHistory`) REFERENCES `scoreHistory` (`ID_ScoreHistory`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
