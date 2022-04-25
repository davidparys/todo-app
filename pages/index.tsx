import { cp } from "fs";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { SingleTask } from "../components/singleTask";

import { motion, AnimatePresence } from "framer-motion";

// design https://dribbble.com/shots/15185058-Collection-Tasks
export type Tasks = {
  id: string;
  title: string;
  completed: boolean;
  createddate: Date;
  collectionID: number;
};
export type Collections = {
  id: number;
  title: string;
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const Home: NextPage = () => {
  const [task, setTask] = useState<
    string | number | readonly string[] | undefined
  >("");

  const [todo, setTodo] = useState<Tasks[]>([]);
  useEffect(() => {
    if (window) {
      const collectionItems = window.localStorage.getItem("collections");
      if (collectionItems) {
        setCollections(JSON.parse(collectionItems));
      }
      const todoItems = window.localStorage.getItem("todo");
      if (todoItems) {
        setTodo(JSON.parse(todoItems));
      }
    }
  }, []);

  const [collections, setCollections] = useState<Collections[]>([]);
  const [collection, setCollection] = useState<
    string | number | readonly string[] | undefined
  >("");
  const [creatingCollection, setCreatingCollection] = useState(false);

  const [activeCollection, setActiveCollection] = useState(0);

  useEffect(() => {
    if (todo && todo.length > 0) {
      window.localStorage.setItem("todo", JSON.stringify(todo));
    } else {
      window.localStorage.removeItem("todo");
    }
  }, [todo]);

  const handleCreateTask = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!task) return;
    const title = task as string;

    setTodo((e) => [
      ...e,
      {
        id: `task-${todo.length + 1}`,
        title,
        completed: false,
        createddate: new Date(),
        collectionID: activeCollection,
      },
    ]);
    setTask("");
  };

  const handleCompletedTask = (id: Tasks["id"]) => {
    setTodo((e) =>
      e.map((task) => {
        if (task.id === id) {
          return {
            ...task,
            completed: !task.completed,
          };
        } else {
          return {
            ...task,
          };
        }
      })
    );
  };

  const handleDeleteTask = (id: Tasks["id"]) => {
    setTodo((e) => e.filter((task) => task.id !== id));
  };

  const handleCreateCollection = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!collection) return;
    const title = collection as string;

    setCollections((e) => [
      ...e,
      {
        id: collections.length + 1,
        title,
      },
    ]);
    setCollection("");
    setCreatingCollection(false);
    setActiveCollection(todo.length + 1);
  };

  const handleDeleteCollection = (id: Collections["id"]) => {
    setTodo((setTodos) => {
      const findTodos = setTodos.map((todo) => {
        return todo.collectionID === id ? { ...todo, collectionID: -1 } : todo;
      });
      const filterCollections = findTodos.filter(
        (value) => value.collectionID !== -1
      );
      return filterCollections.length > 0 ? filterCollections : [];
    });

    setCollections((allCollections) => {
      const findCollections = allCollections.map((collection) => {
        return collection.id === id ? { title: "-1", id: -1 } : collection;
      });
      const filterCollections = findCollections.filter(
        (value) => value.id !== -1
      );
      return filterCollections.length > 0 ? filterCollections : [];
    });
  };

  const completedTasks = todo.filter(
    (task) => task.completed && task.collectionID === activeCollection
  );
  const unCompletedTasks = todo.filter(
    (task) => !task.completed && task.collectionID === activeCollection
  );

  useEffect(() => {
    if (collections && collections.length > 0) {
      window.localStorage.setItem("collections", JSON.stringify(collections));
    } else {
      window.localStorage.removeItem("collections");
    }
  }, [collections, setCollections]);
  return (
    <div className="grid grid-cols-[300px,1fr] h-screen ">
      <aside className="bg-gray-800 h-full border-r border-gray-500/20 shadow-md">
        <div className="flex justify-between items-center p-5">
          <p className="font-bold py-5">Collections</p>
          {!creatingCollection && (
            <button
              className="group"
              onClick={() => setCreatingCollection(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 fill-current group-hover:fill-cyan-500 transition-colors"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
        <div>
          <ul className="list-reset">
            <AnimatePresence>
              {collections?.length > 0 &&
                collections.map((collection, index) => (
                  <motion.div
                    key={index}
                    className={`grid grid-cols-[1fr,25px] px-5 w-full ${
                      activeCollection === collection.id
                        ? "bg-cyan-900 text-cyan-50  hover:cursor-auto"
                        : "hover:bg-gray-700/20"
                    }`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <button
                      onClick={() => setActiveCollection(collection.id)}
                      className={` py-4 group  transition-colors flex items-center justify-between `}
                    >
                      <div>{collection.title}</div>
                    </button>
                    <button
                      onClick={() => handleDeleteCollection(collection.id)}
                    >
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
                  </motion.div>
                ))}
              {creatingCollection && (
                <form
                  className="grid grid-cols-[1fr,20px] px-3 py-4"
                  onSubmit={handleCreateCollection}
                >
                  <input
                    type="text"
                    value={collection}
                    className="bg-transparent border-none rounded-md  focus:outline-1 focus:ring-0 "
                    placeholder="Add a Collection"
                    onChange={(e) => setCollection(e.target.value)}
                  />
                  <button type="submit">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 fill-current hover:fill-white"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                  </button>
                </form>
              )}
            </AnimatePresence>
          </ul>
        </div>
      </aside>
      <main className="w-full">
        <div className="w-1/2 mx-auto py-5">
          {activeCollection === 0 ? (
            <div className="rounded-md p-5 flex justify-center items-center">
              <div className="text-2xl">
                You currently have no collection selected
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-medium">Tasks</h2>
              <form
                onSubmit={handleCreateTask}
                className=" grid grid-cols-[15px,6fr] gap-x-5 my-10"
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
                <label className="sr-only">Add a todo</label>
                <input
                  type="text"
                  value={task}
                  className="bg-transparent border-none rounded-md p-2 focus:outline-1 focus:ring-cyan-50/20"
                  placeholder="Add a todo"
                  onChange={(e) => setTask(e.target.value)}
                />
              </form>
              <AnimatePresence>
                {unCompletedTasks.length > 0 && (
                  <motion.p
                    variants={container}
                    initial="hidden"
                    animate="show"
                    exit="hidden"
                    className="mb-3"
                  >
                    Tasks - {unCompletedTasks.length}
                  </motion.p>
                )}
              </AnimatePresence>
              <motion.ul
                className="space-y-1 mb-5"
                variants={container}
                initial="hidden"
                animate="show"
                exit="hidden"
              >
                <AnimatePresence>
                  {todo &&
                    unCompletedTasks?.length > 0 &&
                    unCompletedTasks.map((todo, index) => (
                      <SingleTask
                        completed={todo.completed}
                        createddate={todo.createddate}
                        id={todo.id}
                        title={todo.title}
                        onChange={() => handleCompletedTask(todo.id)}
                        onDelete={() => handleDeleteTask(todo.id)}
                        key={`uncompleted-${todo.id}`}
                        collectionID={todo.collectionID}
                        subTasks={[]}
                      />
                    ))}
                </AnimatePresence>
              </motion.ul>
              <p className="mb-3">Completed Tasks - {completedTasks.length}</p>
              <motion.ul
                className="space-y-1 mb-5"
                variants={container}
                initial="hidden"
                animate="show"
              >
                <AnimatePresence>
                  {todo &&
                    todo?.length > 0 &&
                    completedTasks.map((todo, index) => (
                      <SingleTask
                        completed={todo.completed}
                        createddate={todo.createddate}
                        id={todo.id}
                        title={todo.title}
                        onChange={() => handleCompletedTask(todo.id)}
                        onDelete={() => handleDeleteTask(todo.id)}
                        key={`completed-${todo.id}`}
                        collectionID={todo.collectionID}
                      />
                    ))}
                </AnimatePresence>
              </motion.ul>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
