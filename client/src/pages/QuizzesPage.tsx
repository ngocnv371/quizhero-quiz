import { Container, Paper } from "@mui/material";

import QuizzesTable from "../containers/QuizzesTable";

export default function QuizzesPage() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <QuizzesTable />
      </Paper>
    </Container>
  );
}
