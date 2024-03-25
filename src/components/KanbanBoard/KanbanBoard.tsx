import { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import KanbanColumns from "../KanbanColumns/KanbanColumns";
import { paint } from "../paint";
import axios from "axios";

//reference for DragDropContext
//https://github.com/atlassian/react-beautiful-dnd/blob/master/docs/api/drag-drop-context.md
export default function KanbanBoard({ permissions, loginFunction }) {
  //setup the three states for the kanban board
  const [available, setAvailable] = useState<Array<paint>>([]);
  const [runningLow, setRunningLow] = useState<Array<paint>>([]);
  const [outOfStock, setOutOfStock] = useState<Array<paint>>([]);

  //API call to retrieve list of paints from the backend and add to available paints
  useEffect(() => {
    axios
      .get(
        "https://django-paint-6d3cee377c88.herokuapp.com/api/retrieve-paints"
      )
      .then((response) => {
        let paintArrayavailable = [];
        let paintArrayrunningLow = [];
        let paintArrayoutOfStock = [];

        response.data.paint_json.forEach((element) => {
          const PaintObject = { id: element.pk, ...element.fields };
          switch (element.fields.column) {
            case "1": // Available
              paintArrayavailable.push(PaintObject);
              setAvailable(paintArrayavailable);
              break;
            case "2": // low on paint
              paintArrayrunningLow.push(PaintObject);
              setRunningLow(paintArrayrunningLow);
              break;
            case "3": // out of stock
              paintArrayoutOfStock.push(PaintObject);
              setOutOfStock(paintArrayoutOfStock);
              break;
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const onDragEnd = (result: {
    source: { droppableId: string; index: number };
    destination?: { droppableId: string; index: number };
    draggableId: string;
  }) => {
    // get where we are dropping the item (source),
    // where the item came from (destination),
    // and the id of the item (draggableid)
    const { source, destination, draggableId } = result;

    //if we go out of bounds, we just return nothing and dont do anything
    if (!destination) {
      return;
    }

    // retrieve the paint object we will need to move around
    const paint = findItemById(draggableId, [
      ...available,
      ...runningLow,
      ...outOfStock,
    ]);

    if (!paint) {
      return;
    }

    //two considerations: 1. if changing columns, delete from previous and add to new
    //2. if dragging within a column, find way to change index of array

    //1. changing column functionality
    if (source.droppableId !== destination.droppableId) {
      deleteItem(source.droppableId, draggableId);
      updatePaintColumn(destination.droppableId, paint);
    } else {
      //2. if moving within a row, remove item from array inplace using source position,
      // and insert directly into array at destiantion position
      let paints;
      switch (destination.droppableId) {
        case "1": // Available
          paints = Array.from(available);
          paints.splice(source.index, 1);
          paints.splice(destination.index, 0, paint);
          setAvailable(paints);
          break;
        case "2": // low on paint
          paints = Array.from(runningLow);
          paints.splice(source.index, 1);
          paints.splice(destination.index, 0, paint);
          setRunningLow(paints);
          break;
        case "3": // out of stock
          paints = Array.from(outOfStock);
          paints.splice(source.index, 1);
          paints.splice(destination.index, 0, paint);
          setOutOfStock(paints);
          break;
      }
    }
  };

  //function to insert the paint into its new column based on destination from result above
  function updatePaintColumn(destinationDroppableId: string, paint: paint) {
    let newPaint;
    switch (destinationDroppableId) {
      case "1": // Available
        newPaint = { ...paint };
        setAvailable([...available, newPaint]);
        break;
      case "2": // low on pain
        newPaint = { ...paint };
        setRunningLow([...runningLow, newPaint]);
        break;
      case "3": // out of stock
        newPaint = { ...paint };
        setOutOfStock([...outOfStock, newPaint]);
        break;
    }
    axios
      .post(
        "https://django-paint-6d3cee377c88.herokuapp.com/api/update-paints",
        {
          id: paint.id,
          newStock: paint.currentStock,
          newColumn: destinationDroppableId,
        }
      )
      .then((response) => {})
      .catch((error) => {
        console.log(error);
      });
  }
  //easy way of removing from old array
  function deleteItem(sourceDroppableId: string, paintId: string) {
    switch (sourceDroppableId) {
      case "1":
        setAvailable(removeItemById(paintId, available));
        break;
      case "2":
        setRunningLow(removeItemById(paintId, runningLow));
        break;
      case "3":
        setOutOfStock(removeItemById(paintId, outOfStock));
        break;
    }
  }

  //retrieve item by id above
  function findItemById(id: string, array: Array<paint>) {
    return array.find((item) => item.id == id);
  }

  //delete the item based on id above
  function removeItemById(id: string, array: Array<paint>) {
    return array.filter((item) => item.id != id);
  }

  //Top level update paint function that takes in a paint,
  //the number we want to update current stock to, and the id of the column its currently in.
  //Requires data passed from KanbanColumns.tsx file
  const updatePaints = (
    paint: paint,
    newStock: number,
    droppableId: string
  ) => {
    switch (droppableId) {
      case "1":
        setAvailable(
          available.map((el) =>
            el.id == paint.id ? { ...el, currentStock: newStock } : el
          )
        );
        break;
      case "2":
        setRunningLow(
          runningLow.map((el) =>
            el.id == paint.id ? { ...el, currentStock: newStock } : el
          )
        );
        break;
      case "3":
        setOutOfStock(
          outOfStock.map((el) =>
            el.id == paint.id ? { ...el, currentStock: newStock } : el
          )
        );
        break;
    }

    // send the id and the newstock amount and pass it into the backend for update
    axios
      .post(
        "https://django-paint-6d3cee377c88.herokuapp.com/api/update-paints",
        {
          id: paint.id,
          newStock: newStock,
          newColumn: droppableId,
        }
      )
      .then((response) => {})
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="main-content py-5">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="row py-2">
          <KanbanColumns
            title={"Available"}
            paints={available}
            id={"1"}
            permissions={permissions}
            updatePaint={updatePaints}
          />

          <KanbanColumns
            title={"Running Low"}
            paints={runningLow}
            id={"2"}
            permissions={permissions}
            updatePaint={updatePaints}
          />

          <KanbanColumns
            title={"Out of Stock"}
            paints={outOfStock}
            id={"3"}
            permissions={permissions}
            updatePaint={updatePaints}
          />
        </div>
      </DragDropContext>
    </div>
  );
}
