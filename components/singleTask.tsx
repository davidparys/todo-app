import React, { FormEvent, useEffect } from "react";
import { Tasks } from "../pages";
import { motion, AnimatePresence } from "framer-motion";

interface IsingleTask extends Tasks {
  onChange: () => void;
  onDelete: () => void;
  isSubTask?: boolean;
  subTasks?: subTask[];
}

const singleItemAnimation = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

interface subTask extends Tasks {
  parentId: string;
}

export const SingleTask: React.FC<IsingleTask> = ({
  id,
  completed,
  title,
  onChange,
  onDelete,
  collectionID,
  subTasks,
  isSubTask = false,
}) => {
  const [subTask, setSubTask] = React.useState<
    string | number | readonly string[] | undefined
  >("");

  const [subTasksList, setSubTasks] = React.useState<subTask[]>(
    subTasks ? subTasks : []
  );

  useEffect(() => {}, [subTasksList]);

  const [isCreatingSubtask, setIsCreatingSubtask] = React.useState(false);
  const handleCreateSubtask = () => {
    setIsCreatingSubtask((e) => !e);
  };

  const handleCreateSubTask = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!subTask) return;
    const title = subTask as string;

    setSubTasks((e) => [
      ...e,
      {
        id: `task-${subTasksList.length + 1}`,
        title,
        completed: false,
        createddate: new Date(),
        collectionID: collectionID,
        parentId: id,
      },
    ]);
    setSubTask("");
  };

  return (
    <>
      <motion.li
        variants={singleItemAnimation}
        className={`group relative list-none p-3 rounded-md bg-gray-800 text-cyan-50 ${
          subTasks && subTasks?.length > 0
            ? "h-[70px] grid grid-rows-2 gap-y-3"
            : ""
        }`}
      >
        <div className=" grid grid-cols-[25px,1fr]">
          <input
            id={id.toString()}
            type="checkbox"
            className=" checked:bg-cyan-700 self-center focus:outline-cyan-500 focus:outline-1 focus:bg-cyan-700/30   rounded-full"
            checked={completed}
            onChange={onChange}
          />
          <label className="text-cyan-50 self-center" htmlFor={id.toString()}>
            {completed ? <del>{title}</del> : <>{title}</>}
          </label>
          <div className="hidden group-hover:flex absolute right-5  top-0 bottom-0  items-center space-x-3">
            {!isSubTask && (
              <button
                className="hover:text-cyan-100"
                onClick={() => handleCreateSubtask()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h7a1 1 0 100-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
                </svg>
              </button>
            )}
            <button className="hover:text-cyan-100" onClick={onDelete}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 fill-current"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
        {subTasks && subTasks?.length > 0 && (
          <div className="grid grid-cols-[25px,1fr] text-orange-300/40">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h7a1 1 0 100-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
            </svg>
            <div>
              {" "}
              {subTasksList.filter((e) => e.completed).length}
              {"/"}
              {subTasksList.filter((e) => !e.completed).length}
            </div>
          </div>
        )}
      </motion.li>
      {isCreatingSubtask && (
        <form
          onSubmit={handleCreateSubTask}
          className=" grid grid-cols-[15px,6fr] gap-x-5 my-10 pl-5"
        >
          <button
            type="submit"
            className="rounded-md self-center text-cyan-500 aspect-square"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 fill-current"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <label className="sr-only">Add a subtask</label>
          <input
            type="text"
            value={subTask}
            className="bg-transparent border-none rounded-md p-2 focus:outline-1 focus:ring-cyan-50/20"
            placeholder="Add a todo"
            onChange={(e) => setSubTask(e.target.value)}
          />
        </form>
      )}
      {isCreatingSubtask &&
        subTasksList &&
        subTasksList.length > 0 &&
        subTasksList.map((subTask, index) => (
          <div key={index} className="pl-5">
            <SingleTask
              onChange={() => console.log("")}
              onDelete={() => console.log("")}
              id={subTask.id}
              collectionID={collectionID}
              completed={subTask.completed}
              createddate={subTask.createddate}
              title={subTask.title}
              isSubTask
            />
          </div>
        ))}
    </>
  );
};
