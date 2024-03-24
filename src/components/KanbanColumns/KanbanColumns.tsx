import React from "react";
import { Droppable } from "react-beautiful-dnd";
import Paint from "../Paint/Paint";
import { paint } from "../paint";

type KanbanColumns = {
  title: string;
  paints: Array<paint>;
  id: string;
  permissions: Array<string>;
  updatePaint: (paint: paint, newStock: number, droppableId: string) => void;
};

//Reference for Droppable
//https://github.com/atlassian/react-beautiful-dnd/blob/master/docs/api/droppable.md
export default function KanbanColumns({
  title,
  paints,
  id,
  permissions,
  updatePaint,
}: KanbanColumns) {
  // use droppable from react-beautiful-dnd

  //Second level of the updatePaint function. We have this function specifically to retrieve column id
  //Requires data from Paint.tsx, specifically the modified paint and the number we want to update currentStock to
  const updatePaint2 = (paint: paint, newStock: number) => {
    console.log(paint, newStock);
    updatePaint(paint, newStock, id);
  };

  return (
    <div className="col-4">
      <h1 className="title">{title}</h1>
      <div className="card bg-light">
        <Droppable droppableId={id}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {paints.map((paint, index) => (
                <Paint
                  key={index}
                  paint={paint}
                  index={index}
                  permissions={permissions}
                  updatePaint={updatePaint2}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
}
