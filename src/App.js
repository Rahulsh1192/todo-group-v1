import React, { useEffect, useState } from "react";
import { useFetchTodosQuery } from "./features/todos/todoApiSlice";
import "./App.css";
import { Grid, Button, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
function App() {
  const { data = [], isFetching } = useFetchTodosQuery();
  const [newFromIndex, setNewFromIndex] = useState(1);
  const [newToIndex, setNewToIndex] = useState(10);
  const [groupData, setGroupData] = useState();
  const [showTodos, setshowTodos] = useState(false);
  useEffect(() => {
    setGroupData([
      {
        id: 1,
        fromIndex: newFromIndex,
        toIndex: newToIndex,
        disableFrom: true,
        disableTo: true,
      },
    ]);
  }, [data]);

  console.log(data, groupData);

  function handleAddGroup() {
    if (groupData.length >= 5) {
      alert("Maximum group count can not be greater than 5!");
      return;
    }
    setGroupData((pre) => {
      const startObj = {
        id: pre.length + 1,
        fromIndex: 1,
        toIndex: "",
        disableFrom: true,
        disableTo: false,
      };
      const middleObj = {
        id: pre.length + 1,
        fromIndex: "",
        toIndex: "",
        disableFrom: false,
        disableTo: false,
      };
      const lastObj = {
        id: pre.length + 1,
        fromIndex: "",
        toIndex: 10,
        disableFrom: false,
        disableTo: true,
      };

      if (pre.length == 1) {
        return [startObj, lastObj];
      } else {
        debugger;
        console.log(pre);
        return [...pre.slice(0, pre.length - 1), middleObj, lastObj];
      }
    });
  }
  const handleIndexInput = (event, index) => {
    debugger;
    const groupNumber = index;
    const array = groupData.map((ele, i) => {
      if (i == groupNumber) {
        return { ...ele, [event.target.name]: +event.target.value };
      } else {
        return { ...ele };
      }
    });
    console.log(array);
    setGroupData(array);
  };

  function validateGroups(groups) {
    debugger;
    // let totalRange
    // Rule 1: Check if the entire range of 1-10 is covered and no group goes outside the range

    const coveredRange = groups.reduce((acc, group) => {
      try {
        if (!group.fromIndex || !group.toIndex) {
          throw new Error("fromIndex and toIndex cannot be empty!.");
        } else if (group.fromIndex === group.toIndex) {
          throw new Error(
            "fromIndex and toIndex cannot be the same within the same group."
          );
        }
      } catch (err) {
        alert(err);
      }

      return acc.concat(
        Array.from(
          { length: group.toIndex - group.fromIndex + 1 },
          (_, i) => i + group.fromIndex
        )
      );
    }, []);
    console.log(coveredRange);

    const isRangeCovered = coveredRange.every((num) => num >= 1 && num <= 10);
    const isUnique = [...new Set(coveredRange)].length === coveredRange.length;
    // Rule 4: Ensure that the total number of elements across all groups does not exceed 10
    const totalElements = coveredRange.length;
    const isValidTotalElements = totalElements <= 10;
    try {
      if (!isValidTotalElements && isUnique && isRangeCovered) {
        throw new Error(
          "The entire range of 1- 10 should be covered and no group can go outside the range"
        );
      }
    } catch (err) {
      alert(err);
    }
    // Rule 2: Check for any gaps between consecutive groups
    const hasGaps = groups.some((group, index) => {
      try {
        if (index === 0) return false;
        const prevGroup = groups[index - 1];
        if (group.fromIndex - prevGroup.toIndex > 1) {
          throw new Error(
            " There should not be any gaps between consecutive groups."
          );
        }
        return group.fromIndex - prevGroup.toIndex !== 1;
      } catch (err) {
        alert(err);
      }
    });

    // Rule 3: Check for any overlap between consecutive groups
    const hasOverlap = groups.some((group, index) => {
      if (index === 0) return false;
      try {
        const prevGroup = groups[index - 1];
        if (group.fromIndex <= prevGroup.toIndex) {
          throw new Error(
            "There should not be overlap between consecutive groups"
          );
        }
        return group.fromIndex <= prevGroup.toIndex;
      } catch (err) {
        alert(err);
      }
    });

    // Rule 5: Ensure that the number of groups is valid
    const isValidNumberOfGroups = groups.length <= 10;

    // Final validation check
    const isValid =
      isRangeCovered &&
      isUnique &&
      !hasGaps &&
      !hasOverlap &&
      isValidTotalElements &&
      isValidNumberOfGroups;

    return isValid;
  }

  function showStatusHandler() {
    setshowTodos(validateGroups(groupData));
    console.log(validateGroups(groupData));
  }
  function deleteHandler(index) {
    setGroupData((pre) => {
      if (index == 0) {
        alert("One Gruop is mandatory!");
        return pre;
      } else {
        return pre.filter((ele, i) => {
          return i != index;
        });
      }
    });
  }
  return (
    <div className="App">
      <header className="App-header">
        <p>TODO APP</p>
        <Grid
          container
          spacing={5}
          rowGap={5}
          sx={{
            padding: "20px",
            background: "#cccccc3d",
            width: "95%",
            marginTop: 10,
          }}
        >
          <Grid item xs={12}>
            {" "}
            {!isFetching &&
              groupData.map((element, index) => {
                return (
                  <Grid
                    key={index}
                    container
                    justifyContent={"flex-start"}
                    alignItems={"center"}
                    noWrap
                    sx={{
                      marginBottom: 5,
                      // flexWrap: "nowrap",
                      background: "",
                    }}
                  >
                    <Grid item xs={2} alignItems="center" spacing={2} container>
                      <Grid item>
                        {index != 0 ? (
                          <IconButton
                            aria-label="delete"
                            onClick={() => deleteHandler(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        ) : (
                          <IconButton
                            aria-label="delete"
                            onClick={() => deleteHandler(index)}
                          >
                            {" "}
                          </IconButton>
                        )}
                      </Grid>
                      <Grid item>
                        <Typography>{`Group ${index + 1}`}</Typography>
                      </Grid>
                      <Grid item>
                        <input
                          name="fromIndex"
                          type="text"
                          disabled={element.disableFrom}
                          value={element.fromIndex}
                          className="inputStyle"
                          onChange={(event) => {
                            if (+event.target.value.trim() <= 10) {
                              setNewFromIndex(
                                parseInt(event.target.value.trim())
                              );
                              handleIndexInput(event, index);
                            } else {
                              alert("number can't be greater than 10");
                            }
                          }}
                        />
                      </Grid>
                      <Grid item>
                        <input
                          name="toIndex"
                          type="text"
                          className="inputStyle"
                          value={element.toIndex}
                          disabled={element.disableTo}
                          onChange={(event) => {
                            if (+event.target.value.trim() <= 10) {
                              setNewToIndex(
                                parseInt(event.target.value.trim())
                              );
                              handleIndexInput(event, index);
                            } else {
                              alert("number can't be greater than 10");
                            }
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Grid item xs={10} sx={{ textAlign: "start" }}>
                      {showTodos &&
                        data
                          .slice(element?.fromIndex, element?.toIndex + 1)
                          .map((e, i) => {
                            return (
                              <span
                                style={{
                                  color: e.completed ? "green" : "red",
                                  padding: "2px 5px",
                                }}
                              >{`(${i + 1})${e.title}(${e.completed}),`}</span>
                            );
                          })}
                    </Grid>
                  </Grid>
                );
              })}
          </Grid>
          <Grid item container spacing={1}>
            <Grid item>
              <Button
                variant="contained"
                style={{ marginLeft: 0 }}
                onClick={handleAddGroup}
              >
                +Add Group
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                style={{ marginLeft: 0 }}
                onClick={showStatusHandler}
              >
                Show Status
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </header>
    </div>
  );
}

export default App;
