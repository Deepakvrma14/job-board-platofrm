import { Grid, Typography, Button, Box } from "@material-ui/core";

const Welcome = (props) => {
  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{
        padding: "30px",
        minHeight: "93vh",
        backgroundColor: "#ffffff",
        color: "#333",
        textAlign: "center",
      }}
    >
      <Grid item>
        <Typography
          variant="h2"
          style={{
            fontWeight: "bold",
            marginBottom: "20px",
            color: "#1e3c72",
          }}
        >
          Welcome 
        </Typography>
        <Typography
          variant="h5"
          style={{
            marginBottom: "15px",
            fontStyle: "italic",
            color: "#555",
          }}
        >
          "Connecting talent with opportunity"
        </Typography>
        <Typography
          variant="body1"
          style={{
            marginBottom: "30px",
            maxWidth: "600px",
            lineHeight: "1.6",
          }}
        >
          Discover thousands of job opportunities in the tech industry. Whether
          you're a developer, designer, or data scientist, we have the perfect
          job for you. Start your journey today and take the next step in your
          career.
        </Typography>
        <Box style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
        
          <Button
            variant="outlined"
            style={{
              borderColor: "#1e3c72",
              color: "#1e3c72",
              padding: "10px 20px",
              fontSize: "16px",
            }}
            onClick={() => alert("Post a Job")}
          >
            Start Now
          </Button>
        </Box>
      </Grid>
      <Grid item style={{ marginTop: "50px" }}>
        <Typography
          variant="h4"
          style={{
            fontWeight: "bold",
            marginBottom: "20px",
            color: "#1e3c72",
          }}
        >
          Why Choose Us?
        </Typography>
        <Typography
          variant="body1"
          style={{
            marginBottom: "10px",
            maxWidth: "600px",
            lineHeight: "1.6",
          }}
        >
          - Access to thousands of job listings in the tech industry.
        </Typography>
        <Typography
          variant="body1"
          style={{
            marginBottom: "10px",
            maxWidth: "600px",
            lineHeight: "1.6",
          }}
        >
          - Easy-to-use platform for job seekers and employers.
        </Typography>
        <Typography
          variant="body1"
          style={{
            marginBottom: "10px",
            maxWidth: "600px",
            lineHeight: "1.6",
          }}
        >
          - Trusted by top companies and startups worldwide.
        </Typography>
      </Grid>
    </Grid>
  );
};

export const ErrorPage = (props) => {
  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{
        padding: "30px",
        minHeight: "93vh",
        backgroundColor: "#ffffff",
        color: "#333",
        textAlign: "center",
      }}
    >
      <Grid item>
        <Typography
          variant="h2"
          style={{ fontWeight: "bold", marginBottom: "20px", color: "#ff4e50" }}
        >
          Error 404
        </Typography>
        <Typography variant="h6" style={{ marginBottom: "20px" }}>
          The page you are looking for does not exist.
        </Typography>
        <Button
          variant="contained"
          style={{
            backgroundColor: "#ff4e50",
            color: "#fff",
            padding: "10px 20px",
          }}
          onClick={() => alert("Go Back")}
        >
          Go Back
        </Button>
      </Grid>
    </Grid>
  );
};

export default Welcome;