import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import { Calendar } from "./Calendar";

export const QueryParamsCalendarController = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const month = new URLSearchParams(search).get("m");
  const year = new URLSearchParams(search).get("y");
  const today = moment();
  const [currentMonthMoment, setCurrentMonthMoment] = useState(
    month && year ? moment(`${month}${year}`, "MMYYYY") : today
  );
  const [gitEvents, setGitEvents] = useState(null);

  const fetchData = async (currentYear, month) => {
    const startDate = `${currentYear}-${month}-01T00:00:00Z`;
    const endDate = `${currentYear}-${month}-30T23:59:59Z`;

    try {
      const response = await axios.get(
        `https://api.github.com/repos/testing-library/react-testing-library/commits?since=${startDate}&until=${endDate}`
      );
      setGitEvents(response.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const incrementMonth = async () => {
    const newMonth = moment(currentMonthMoment).add(1, "months");
    navigate(`?m=${newMonth.format("MM")}&y=${newMonth.format("YYYY")}`);
    await fetchData(newMonth.format("YYYY"), newMonth.format("MM"));
    setCurrentMonthMoment(newMonth);
  };

  const decrementMonth = async () => {
    const newMonth = moment(currentMonthMoment).subtract(1, "months");
    navigate(`?m=${newMonth.format("MM")}&y=${newMonth.format("YYYY")}`);
    await fetchData(newMonth.format("YYYY"), newMonth.format("MM"));
    setCurrentMonthMoment(newMonth);
  };

  useEffect(() => {
    fetchData(
      year ?? moment().year(),
      currentMonthMoment.format("MM") ?? moment().month().format("MM")
    );
  }, [year, currentMonthMoment]);

  return (
    <Calendar
      month={currentMonthMoment.format("MM")}
      year={currentMonthMoment.format("YYYY")}
      onPrev={decrementMonth}
      onNext={incrementMonth}
      gitEvents={gitEvents}
    />
  );
};
