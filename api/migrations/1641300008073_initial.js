/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("topics", {
    id: "id",
    name: { type: "character varying(50)", notNull: true },
  });

  pgm.createTable("statuses", {
    id: "id",
    name: { type: "character varying(50)", notNull: true },
  });

  pgm.sql(
    "INSERT INTO statuses(name) VALUES ('draft'), ('pending'), ('approved'), ('rejected'), ('deleted')"
  );

  pgm.createTable("quizzes", {
    id: "id",
    name: { type: "character varying(250)", notNull: true },
    topicId: { type: "integer", notNull: true },
    statusId: {
      type: "integer",
      notNull: true,
      references: '"statuses"',
      onDelete: "cascade",
    },
    createdById: { type: "integer", notNull: true },
    createdAt: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });
  pgm.createIndex("quizzes", "name");
  pgm.createIndex("quizzes", "topicId");

  pgm.createView(
    "approved_quizzes",
    {},
    'SELECT "id", "name", "topicId", "createdById", "createdAt" FROM quizzes WHERE "statusId" = 3'
  );
  pgm.createView(
    "pending_quizzes",
    {},
    'SELECT "id", "name", "topicId", "createdById", "createdAt" FROM quizzes WHERE "statusId" = 2'
  );

  pgm.createTable("questions", {
    id: "id",
    text: { type: "character varying(250)", notNull: true },
    choice0: { type: "character varying(50)", notNull: true },
    choice1: { type: "character varying(50)", notNull: true },
    choice2: { type: "character varying(50)", notNull: true },
    choice3: { type: "character varying(50)", notNull: true },
    correct0: { type: "bit", notNull: true },
    correct1: { type: "bit", notNull: true },
    correct2: { type: "bit", notNull: true },
    correct3: { type: "bit", notNull: true },
    quizId: {
      type: "integer",
      notNull: true,
      references: '"quizzes"',
      onDelete: "cascade",
    },
    createdById: { type: "integer", notNull: true },
    createdAt: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("questions");
  pgm.dropView("pending_quizzes");
  pgm.dropView("approved_quizzes");

  pgm.dropIndex("quizzes", "name");
  pgm.dropIndex("quizzes", "topicId");
  pgm.dropTable("quizzes");
  pgm.dropTable("statuses");
  pgm.dropTable("topics");
};
