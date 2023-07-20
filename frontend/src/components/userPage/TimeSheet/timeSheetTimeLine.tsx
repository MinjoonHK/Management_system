import { Button, Card } from "antd";
import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { DeleteOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGripVertical } from "@fortawesome/free-solid-svg-icons";

function TimeLine({ selectedValue }) {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Schedule 1",
    },
    {
      id: 2,
      title: "Schedule 2",
    },
    {
      id: 3,
      title: "Schedule 3",
    },
  ]);
  const [newTitle, setNewTitle] = useState("");
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    if (result.destination.droppableId === "trash") {
      // 휴지통으로 드롭한 경우
      const filteredItems = items.filter(
        (item) => item.id !== reorderedItem.id
      );
      setTasks(filteredItems);
    } else {
      // 다른 위치로 드롭한 경우
      items.splice(result.destination.index, 0, reorderedItem);
      setTasks(items);
    }
  };

  return (
    <div>
      <Card
        title={
          <div
            style={{
              fontWeight: "bold",
              fontSize: "25px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>{selectedValue}</span>
            <span>
              <Button>Add Todo +</Button>
            </span>
          </div>
        }
        bordered={false}
        style={{
          width: "100%",
          border: "solid rgb(226, 226, 226) 1.5px",
        }}
      >
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {tasks.map((task, index) => (
                  <Draggable
                    key={task.id}
                    draggableId={task.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                      >
                        <Card
                          style={{
                            marginBottom: "0.5%",
                            borderColor: "rgb(45,68,134)",
                          }}
                        >
                          <FontAwesomeIcon
                            style={{ marginRight: "5%" }}
                            icon={faGripVertical}
                          />
                          <span>{task.title}</span>
                        </Card>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <Droppable droppableId="trash">
            {(provided) => (
              <div
                style={{ height: "100%" }}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <Card
                  style={{
                    backgroundColor: "rgb(245,245,245)",
                    textAlign: "center",
                  }}
                >
                  <DeleteOutlined style={{ fontSize: "30px", color: "red" }} />
                  <div style={{ fontWeight: "bold", fontSize: "18px" }}>
                    Drop here to delete
                  </div>
                </Card>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Card>
    </div>
  );
}

export default TimeLine;
