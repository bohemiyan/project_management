# Use an official Node.js 18 image as the base image
FROM node:slim

# Set the working directory
WORKDIR /app
ENV PORT=9696

# Production Configuration
# ENV MONGODB_URI=
# ENV CLIENT_URL=


#Required Config
# ENV SENDGRID_API_KEY=
# ENV MOODLE_URL=
# ENV MOODLE_API_KEY=

# Create necessary directories
RUN mkdir -p /LMS-JOBS/LOGS /LMS-JOBS/FILES /LMS-JOBS/Backup

# Copy the binary file from the dist folder into the container
COPY dist/lms-jobs ./lms-jobs

# Make the binary executable
RUN chmod +x ./lms-jobs

# Expose port 9696
EXPOSE ${PORT}

# Run the binary
CMD ["./lms-jobs"]