import { FileId } from "@src/tools/range";
import express, { Application, NextFunction, Request, Response } from "express"

import multer from 'multer';

const storage = multer.diskStorage({
  destination: (
    _: Request,
    __: multer.File,
    callback: CallableFunction,
  ) => {
    callback(null, '/files');
  },
  filename: (_, file, callback) => {
    const extArray = file.mimetype.split('/');
    const extension = extArray[extArray.length - 1];
    callback(null, `${FileId.next().value}.${extension}`);
  },
});

const fileFilter = (
  _: Request,
  file: multer.File,
  callback: CallableFunction,
) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/))
    return callback(
      new Error('Only image files are allowed'),
      false,
    );
  callback(null, true);
};


export const configurationStorage = () => multer({ storage, fileFilter });