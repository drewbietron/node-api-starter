import { resolver } from "graphql-sequelize";
import Sequelize from "sequelize";

export default function defaultResolver(model) {
  return resolver(model, {
    async before(options) {
      // Default order of created_at -- graphql-sequelize will default
      // to sorting by primary key which is UUID.  Since UUID's aren't
      // the most performant thing to sort by in SQL, and we also have no
      // good reason to default sort by uuid, well use created_at
      const updatedOptions = {
        ...options,
        order: Sequelize.literal("created_at DESC"),
      };

      return updatedOptions;
    },
    after: (result) => {
      return result;
    },
  });
}
