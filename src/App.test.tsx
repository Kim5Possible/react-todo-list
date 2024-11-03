import { render, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";

describe("App component", () => {
  it("renders the app with an empty list", () => {
    const { getByText, queryByRole } = render(<App />);
    expect(getByText("ToDos")).toBeInTheDocument();
    expect(queryByRole("listitem")).not.toBeInTheDocument();
  });

  it("adds a new item to the list", async () => {
    const { getByRole, getByText, getAllByRole } = render(<App />);
    const input = getByRole("textbox");
    const addButton = getByRole("button", { name: "Add" });
    const itemsContent = ["Test 1", "Test 2", "Test 3"];

    for (const item of itemsContent) {
      fireEvent.change(input, { target: { value: item } });
      fireEvent.click(addButton);
    }

    expect(getAllByRole("listitem")).toHaveLength(3);

    for (const item of itemsContent) {
      expect(getByText(item)).toBeInTheDocument();
    }
  });

  it("deletes an item from the list", async () => {
    const { getByRole, getByText, queryByRole, getByTestId } = render(<App />);
    const input = getByRole("textbox");
    const addButton = getByRole("button", { name: "Add" });
    fireEvent.change(input, { target: { value: "New item" } });
    fireEvent.click(addButton);
    await waitFor(() => getByText("New item"));
    const deleteButton = getByTestId("DeleteIcon");
    fireEvent.click(deleteButton);
    await waitFor(() =>
      expect(queryByRole("listitem")).not.toBeInTheDocument()
    );
  });

  it("completes an item in the list", async () => {
    const { getByRole, getByText, getByTestId } = render(<App />);
    const input = getByRole("textbox");
    const addButton = getByRole("button", { name: "Add" });
    fireEvent.change(input, { target: { value: "New item" } });
    fireEvent.click(addButton);
    await waitFor(() => getByText("New item"));
    const completeButton = getByTestId("CheckCircleOutlineIcon");
    fireEvent.click(completeButton);
    await waitFor(() =>
      expect(completeButton).toHaveClass("MuiSvgIcon-colorSuccess")
    );
  });

  it("filters the list by completed items", async () => {
    const { getByRole, getByText, getAllByTestId, queryByRole } = render(
      <App />
    );
    const input = getByRole("textbox");
    const addButton = getByRole("button", { name: "Add" });
    fireEvent.change(input, { target: { value: "New item 1" } });
    fireEvent.click(addButton);
    fireEvent.change(input, { target: { value: "New item 2" } });
    fireEvent.click(addButton);
    await waitFor(() => getByText("New item 1"));
    await waitFor(() => getByText("New item 2"));
    const completeButton = getAllByTestId("CheckCircleOutlineIcon")[0];
    fireEvent.click(completeButton);
    const filterButton = getByRole("button", { name: "COMPLETED" });
    fireEvent.click(filterButton);
    await waitFor(() =>
      expect(getByRole("listitem")).toHaveTextContent("New item 1")
    );
    expect(
      queryByRole("listitem", { name: "New item 2" })
    ).not.toBeInTheDocument();
  });

  it("filters the list by active items", async () => {
    const { getByRole, getByText, getAllByTestId, queryByRole } = render(
      <App />
    );
    const input = getByRole("textbox");
    const addButton = getByRole("button", { name: "Add" });
    fireEvent.change(input, { target: { value: "New item 1" } });
    fireEvent.click(addButton);
    fireEvent.change(input, { target: { value: "New item 2" } });
    fireEvent.click(addButton);
    await waitFor(() => getByText("New item 1"));
    await waitFor(() => getByText("New item 2"));
    const completeButton = getAllByTestId("CheckCircleOutlineIcon")[0];
    fireEvent.click(completeButton);
    const filterButton = getByRole("button", { name: "ACTIVE" });
    fireEvent.click(filterButton);
    await waitFor(() =>
      expect(getByRole("listitem")).toHaveTextContent("New item 2")
    );
    expect(
      queryByRole("listitem", { name: "New item 1" })
    ).not.toBeInTheDocument();
  });

  it("clear completed items", async () => {
    const { getByRole, getByText, getAllByTestId, queryByRole } = render(
      <App />
    );
    const input = getByRole("textbox");
    const addButton = getByRole("button", { name: "Add" });
    fireEvent.change(input, { target: { value: "New item 1" } });
    fireEvent.click(addButton);
    fireEvent.change(input, { target: { value: "New item 2" } });
    fireEvent.click(addButton);
    await waitFor(() => getByText("New item 1"));
    await waitFor(() => getByText("New item 2"));
    const completeButton = getAllByTestId("CheckCircleOutlineIcon")[0];
    fireEvent.click(completeButton);
    const clearButton = getByText("Clear Completed");
    fireEvent.click(clearButton);
    await waitFor(() =>
      expect(getByRole("listitem")).toHaveTextContent("New item 2")
    );
    expect(
      queryByRole("listitem", { name: "New item 1" })
    ).not.toBeInTheDocument();
  });
});
