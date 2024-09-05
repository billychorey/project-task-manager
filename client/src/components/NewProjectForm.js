import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const NewProjectForm = ({ onSubmit }) => {
  const [serverError, setServerError] = useState(null);

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
  });

  return (
    <Formik
      initialValues={{ title: '', description: '' }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        setServerError(null);

        // Updated fetch URL
        fetch('http://127.0.0.1:5000/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        })
          .then((response) => {
            if (!response.ok) {
              return response.json().then((data) => {
                throw new Error(data.error || 'Unknown error');
              });
            }
            return response.json();
          })
          .then((data) => {
            onSubmit(data);
            resetForm(); // Reset form on success
          })
          .catch((error) => {
            setServerError(error.message);
            console.error('Error creating project:', error);
          })
          .finally(() => {
            setSubmitting(false);
          });
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <div>
            <label htmlFor="title">Title</label>
            <Field name="title" type="text" />
            <ErrorMessage name="title" component="div" />
          </div>

          <div>
            <label htmlFor="description">Description</label>
            <Field name="description" as="textarea" />
            <ErrorMessage name="description" component="div" />
          </div>

          {serverError && <div style={{ color: 'red' }}>{serverError}</div>}

          <button type="submit" disabled={isSubmitting}>
            Create Project
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default NewProjectForm;
