import React from "react";
import { Tasks } from "../pages";
import { motion, AnimatePresence } from "framer-motion";

interface IsingleTask extends Tasks {
  onChange: () => void;
  onDelete: () => void;
}

const singleItemAnimation = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

export const SingleTask: React.FC<IsingleTask> = ({
  id,
  completed,
  title,
  onChange,
  onDelete,
}) => {
  return (
    <motion.li
      variants={singleItemAnimation}
      className="group relative list-none p-3 rounded-md bg-gray-800 grid grid-cols-[25px,1fr] text-cyan-50"
    >
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
      <div className="hidden group-hover:flex absolute right-5  top-0 bottom-0  items-center ">
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
    </motion.li>
  );
};
