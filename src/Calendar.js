import React from "react";
import moment from "moment";
import "./Calendar.css";

export const getDaysInMonth = (monthMoment) => {
  const monthCopy = monthMoment.clone();
  monthCopy.startOf("month");

  let days = [];

  while (monthCopy.month() === monthMoment.month()) {
    days.push(monthCopy.clone());
    monthCopy.add(1, "days");
  }

  return days;
};

export const segmentIntoWeeks = (dayMoments) => {
  let weeks = [];
  let currentWeek = [];

  for (let day of dayMoments) {
    currentWeek.push(day.clone());

    if (day.format("dddd") === "Sunday") {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }
  return weeks;
};

const padWeekFront = (week, padWith = null) => {
  return [...Array(7 - week.length).fill(padWith), ...week];
};

const padWeekBack = (week, padWith = null) => {
  return [...week, ...Array(7 - week.length).fill(padWith)];
};

const daysOfTheWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const Calendar = ({ month, year, onPrev, onNext, gitEvents }) => {
  const currentMonthMoment = moment(`${month}${year}`, "MMYYYY");
  const weeks = segmentIntoWeeks(getDaysInMonth(currentMonthMoment));

  return (
    <div>
      <div className="CalendarTableWrap">
        <div className="CalendarControlsWrap">
          <div className="CalendarControls">
            <h1>{currentMonthMoment.format("MMMM YYYY")}</h1>
            <div className="ButtonContainer">
              <button onClick={onPrev}>&lt;</button>
              <button onClick={onNext}>&gt;</button>
            </div>
          </div>
        </div>

        <div className="CalendarTable">
          <div className="CalendarHeading">
            {daysOfTheWeek.map((day) => (
              <div className="CalendarHeadingCell" key={day}>
                {day}
              </div>
            ))}
          </div>
          {weeks.map((week, i) => {
            const displayWeek =
              i === 0
                ? padWeekFront(week, null)
                : i === weeks.length - 1
                ? padWeekBack(week, null)
                : week;

            return (
              <div className="CalendarRow" key={i}>
                {displayWeek.map((dayMoment, j) => (
                  <div
                    className="CalendarCellWrap"
                    key={dayMoment ? dayMoment.format("D") : `${i}-${j}`}
                  >
                    <div className="CalendarCell">
                      {dayMoment ? (
                        <>
                          <div className="NumberCircle">
                            {dayMoment.format("D")}
                          </div>
                          <div
                            className="EventContainer"
                            style={{
                              backgroundColor:
                                gitEvents &&
                                gitEvents.length > 0 &&
                                gitEvents.some((event) =>
                                  moment(event.commit.author.date).isSame(
                                    dayMoment,
                                    "day"
                                  )
                                )
                                  ? "#eae9e9"
                                  : "transparent",
                            }}
                          >
                            {gitEvents &&
                              gitEvents.length > 0 &&
                              gitEvents
                                .filter((event) => {
                                  return (
                                    moment(event.commit.author.date).format(
                                      "D"
                                    ) === dayMoment.format("D")
                                  );
                                })
                                .map((event, index) => (
                                  <div key={index}>{event.commit.message}</div>
                                ))}
                          </div>
                        </>
                      ) : (
                        <div className="CalendarCellEmpty" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
