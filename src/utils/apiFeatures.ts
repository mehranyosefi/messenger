import type { Request } from "express";
import type { Query } from "mongoose";

type QueryString = Request["query"];

export class APIFeatures {
  query: Query<any[], any>;
  queryString: QueryString;

  constructor(query: Query<any[], any>, queryString: QueryString) {
    this.query = query;
    this.queryString = queryString;
  }

  private getStringValue(key: string): string | undefined {
    const value = this.queryString[key];

    return typeof value === "string" ? value : undefined;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludeFields = ["page", "sort", "limit", "fields"];

    excludeFields.forEach((field) => delete queryObj[field]);

    let queryStr = JSON.stringify(queryObj);

    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    const sort = this.getStringValue("sort");

    if (sort) {
      const sortBy = sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-name");
    }

    return this;
  }

  limitFields() {
    const fields = this.getStringValue("fields");

    if (fields) {
      const selectedFields = fields.split(",").join(" ");
      this.query = this.query.select(selectedFields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  paginate() {
    const pageValue = this.getStringValue("page");
    const limitValue = this.getStringValue("limit");

    const parsedPage = Number(pageValue);
    const parsedLimit = Number(limitValue);

    const page =
      Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

    const limit =
      Number.isInteger(parsedLimit) && parsedLimit > 0 ? parsedLimit : 100;

    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
