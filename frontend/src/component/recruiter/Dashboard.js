import React, { useEffect, useState } from "react";
import { Grid, Paper, Typography, makeStyles, CircularProgress } from "@material-ui/core";
import { Bar, Pie, Line } from "react-chartjs-2";
import { Chart, registerables } from 'chart.js';
import axios from "axios";
import apiList from "../../lib/apiList";
import { userType } from "../../lib/isAuth";
Chart.register(...registerables);

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    minHeight: "93vh",
    background: "#f4f6f8",
  },
  card: {
    padding: theme.spacing(3),
    borderRadius: 16,
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
    background: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: 120,
  },
  cardTitle: {
    fontWeight: 600,
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(1),
  },
  cardValue: {
    fontSize: 32,
    fontWeight: 700,
    color: "#222",
  },
  graphPaper: {
    padding: theme.spacing(3),
    borderRadius: 16,
    background: "#fff",
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
    marginTop: theme.spacing(3),
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [applications, setApplications] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        // Fetch jobs posted by recruiter
        const jobsRes = await axios.get(`${apiList.jobs}?myjobs=1`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(jobsRes.data);
        // Fetch all applicants for recruiter's jobs
        const applicantsRes = await axios.get(apiList.applicants, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplicants(applicantsRes.data);
        // Fetch all applications for recruiter
        const applicationsRes = await axios.get(apiList.applications, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(applicationsRes.data);
      } catch (err) {
        // Optionally show error
        setJobs([]);
        setApplicants([]);
        setApplications([]);
      }
      setLoading(false);
    };
    fetchData();
  }, []);
  if (userType() !== "recruiter") {
    return (
      <div className={classes.root} style={{textAlign: 'center'}}>
        <Typography variant="h4" color="error">Access Denied</Typography>
        <Typography variant="subtitle1">This dashboard is only available for recruiters.</Typography>
      </div>
    );
  }



  // Card stats
  const totalJobs = jobs.length;
  const totalApplications = applicants.length;
  const activeEmployees = applicants.filter(a => a.status === "accepted").length;
  const pendingReviews = applicants.filter(a => a.status === "finished").length;

  const stats = [
    { title: "Total Jobs", value: totalJobs },
    { title: "Applications", value: totalApplications },
    { title: "Active Employees", value: activeEmployees },
    { title: "Pending Reviews", value: pendingReviews },
  ];

  // Bar chart: Applications per month (last 6 months)
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const now = new Date();
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(`${monthNames[d.getMonth()]} ${d.getFullYear()}`);
  }
  const applicationsPerMonth = months.map(label => {
    return applicants.filter(a => {
      const date = new Date(a.dateOfApplication);
      return `${monthNames[date.getMonth()]} ${date.getFullYear()}` === label;
    }).length;
  });
  const barData = {
    labels: months,
    datasets: [
      {
        label: "Applications",
        backgroundColor: "#3f51b5",
        data: applicationsPerMonth,
      },
    ],
  };

  // Pie chart: Job types
  const jobTypeCounts = jobs.reduce((acc, job) => {
    acc[job.jobType] = (acc[job.jobType] || 0) + 1;
    return acc;
  }, {});
  const pieLabels = Object.keys(jobTypeCounts);
  const pieData = {
    labels: pieLabels,
    datasets: [
      {
        data: pieLabels.map(type => jobTypeCounts[type]),
        backgroundColor: ["#3f51b5", "#ff9800", "#4caf50", "#e91e63", "#00bcd4"],
      },
    ],
  };

  // Line chart: New employees per week (last 4 weeks)
  const weeks = [];
  for (let i = 3; i >= 0; i--) {
    const start = new Date(now);
    start.setDate(now.getDate() - now.getDay() - i * 7);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    weeks.push({
      label: `Week ${4 - i}`,
      start,
      end,
    });
  }
  const employeesPerWeek = weeks.map(w => {
    return applicants.filter(a => {
      if (a.status !== "accepted") return false;
      const date = new Date(a.dateOfJoining);
      return date >= w.start && date <= w.end;
    }).length;
  });
  const lineData = {
    labels: weeks.map(w => w.label),
    datasets: [
      {
        label: "New Employees",
        data: employeesPerWeek,
        fill: false,
        borderColor: "#09BC8A",
        tension: 0.4,
      },
    ],
  };

  if (loading) {
    return <div className={classes.root} style={{textAlign: 'center'}}><CircularProgress /></div>;
  }
 

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        {stats.map((stat, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Paper className={classes.card} elevation={3}>
              <Typography className={classes.cardTitle} variant="subtitle1">
                {stat.title}
              </Typography>
              <Typography className={classes.cardValue}>{stat.value}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={3} style={{ marginTop: 8 }}>
        <Grid item xs={12} md={6}>
          <Paper className={classes.graphPaper}>
            <Typography variant="h6" style={{ marginBottom: 16 }}>
              Applications Over Time
            </Typography>
            <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper className={classes.graphPaper}>
            <Typography variant="h6" style={{ marginBottom: 16 }}>
              Job Types
            </Typography>
            <Pie data={pieData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper className={classes.graphPaper}>
            <Typography variant="h6" style={{ marginBottom: 16 }}>
              New Employees
            </Typography>
            <Line data={lineData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard; 