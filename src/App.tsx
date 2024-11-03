import { useState } from "react";
import {
  Button,
  ButtonGroup,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { Delete, CheckCircleOutline } from "@mui/icons-material";

function App() {
  const [inputValue, setInputValue] = useState<string>("");
  const [list, setList] = useState<
    { value: string; index: string; isCompleted: boolean }[]
  >([]);
  const [filter, setFilter] = useState<string>("all");
  const itemsLeft = list.filter((item) => !item.isCompleted).length;

  const handleAddItem = () => {
    if (!inputValue) return;
    setList((prevList) => [
      ...prevList,
      { value: inputValue, index: crypto.randomUUID(), isCompleted: false },
    ]);
    setInputValue("");
  };

  const handleCompleteItem = (index: string) =>
    setList((prevList) =>
      prevList.map((item) =>
        item.index === index
          ? { ...item, isCompleted: !item.isCompleted }
          : item
      )
    );

  const handleDeleteItem = (index: string) =>
    setList((prevList) => prevList.filter((item) => item.index !== index));

  const filteredList =
    filter === "completed"
      ? list.filter((item) => item.isCompleted)
      : filter === "active"
      ? list.filter((item) => !item.isCompleted)
      : list;

  const handleFilter = (filter: string) => setFilter(filter);

  const handleClearCompleted = () =>
    setList((prevList) => prevList.filter((item) => !item.isCompleted));

  return (
    <Container
      maxWidth="sm"
      component="main"
      className="mt-40 py-10 bg-violet-50 rounded-lg shadow-[-16px_-10px_40px_rgba(205,163,255,0.4)] shadow-xl"
    >
      <h1 className="text-blue-900 opacity-70 font-raleway text-3xl tracking-wider text-center mb-5">
        ToDos
      </h1>
      <div className="flex">
        <TextField
          id="outlined-multiline-flexible"
          label="What needs to be done?"
          required
          maxRows={4}
          value={inputValue}
          onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full basis-3/4"
        />
        <Button
          variant="contained"
          onClick={handleAddItem}
          className="w-full mt-5 basis-1/4"
        >
          Add{" "}
        </Button>
      </div>
      <List dense>
        {filteredList.map((item) => (
          <ListItem
            className="mb-2 border border-blue-700 border-opacity-30 rounded-lg shadow-[0px_5px_10px_rgba(205,163,255,0.3)_inset]"
            key={item.index.toString()}
            secondaryAction={
              <IconButton
                onClick={() => handleDeleteItem(item.index)}
                edge="end"
                aria-label="delete"
              >
                <Delete />{" "}
              </IconButton>
            }
          >
            <ListItemIcon
              onClick={() => handleCompleteItem(item.index)}
              className="cursor-pointer"
            >
              <CheckCircleOutline
                color={item.isCompleted ? "success" : "disabled"}
              />
            </ListItemIcon>
            <ListItemText
              primary={item.value}
              className={`py-1 ${
                item.isCompleted && "line-through opacity-40"
              }`}
            />
          </ListItem>
        ))}
      </List>
      <footer className="flex justify-between items-center">
        <Typography variant="caption" color="text.secondary">
          {itemsLeft} {itemsLeft === 1 ? "item" : "items"} left
        </Typography>
        <ButtonGroup size="small">
          <Button
            onClick={() => handleFilter("all")}
            variant={filter === "all" ? "contained" : "outlined"}
          >
            ALL
          </Button>{" "}
          <Button
            onClick={() => handleFilter("active")}
            variant={filter === "active" ? "contained" : "outlined"}
          >
            ACTIVE
          </Button>{" "}
          <Button
            onClick={() => handleFilter("completed")}
            variant={filter === "completed" ? "contained" : "outlined"}
          >
            COMPLETED
          </Button>
        </ButtonGroup>
        <Typography
          variant="caption"
          color="text.secondary"
          className="cursor-pointer"
          onClick={handleClearCompleted}
        >
          Clear Completed
        </Typography>
      </footer>
    </Container>
  );
}

export default App;
