import {
  Button,
  Card,
  Checkbox,
  FormControlLabel,
  Grid,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import { Field, FieldArray, Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";

const useStyles = makeStyles({
  formField: {
    width: "100%",
    marginBottom: 16,
  },
  button: {
    margin: "8px 0",
  },
  formGroup: {
    marginBottom: 16,
  },
  error: {
    color: "red",
    fontSize: "0.875rem",
    marginTop: 4,
  },
  container: {
    padding: "16px",
    margin: "auto",
  },
});
const ApiDocumentForm = () => {
  const classes = useStyles();
  const initialValues = {
    api_name: "",
    url: "",
    method: "GET",
    headers: [{ key: "", value: "" }],
    token_required: false,
    token_config: {
      token_url: "",
      token_method: "",
      token_body_type: "json",
      token_body: "",
      token_response_path: "",
    },
    response_config: [{ key: "", value: "" }],
    request_body: "",
    request_body_type: "json",
    form_data: [],
  };

  const validationSchema = Yup.object().shape({
    api_name: Yup.string().required("Required"),
    url: Yup.string().required("Required"),
    method: Yup.string().required("Required"),
    headers: Yup.array().of(
      Yup.object().shape({
        key: Yup.string().required("Required"),
        value: Yup.string(),
      })
    ),
    token_config: Yup.object().when("token_required", {
      is: true,
      then: () =>
        Yup.object().shape({
          token_url: Yup.string().required("Required"),
          token_method: Yup.string().required("Required"),
          token_body_type: Yup.string().when("token_method", {
            is: (method) => method !== "GET",
            then: () => Yup.string().required("Required"),
            otherwise: () => Yup.string().notRequired(),
          }),
          token_body: Yup.string().when("token_body_type", {
            is: (type) => ["raw", "json"].includes(type),
            then: () => Yup.string().required("Required"),
            otherwise: () => Yup.string().notRequired(),
          }),
          token_response_path: Yup.string().required("Required"),
        }),
    }),
    response_config: Yup.array().of(
      Yup.object().shape({
        key: Yup.string().required("Required"),
        value: Yup.string(),
      })
    ),
    request_body: Yup.string().when("method", {
      is: (method) => ["POST", "PUT", "PATCH", "DELETE"].includes(method),
      then: () => Yup.string().required("Required"),
    }),
    form_data: Yup.array().when("request_body_type", {
      is: "formData",
      then: () =>
        Yup.array()
          .min(1, "At least one form data field is required")
          .of(
            Yup.object().shape({
              key: Yup.string().required("Required"),
              value: Yup.string(),
            })
          ),
    }),
  });

  const onSubmit = (values) => {
    console.log(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ values, errors, touched, setFieldValue }) => (
        <Form className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <Card className="p-4">
                <Typography variant="h6" color="primary" className="my-2">
                  Api Details
                </Typography>
                <div className={classes.formGroup}>
                  <TextField
                    size="small"
                    className={classes.formField}
                    label="API Name"
                    name="api_name"
                    variant="outlined"
                    fullWidth
                  />
                  {errors.api_name && touched.api_name ? (
                    <div className={classes.error}>{errors.api_name}</div>
                  ) : null}
                </div>
                <div className={classes.formGroup}>
                  <TextField
                    size="small"
                    className={classes.formField}
                    label="URL"
                    name="url"
                    variant="outlined"
                    fullWidth
                  />
                  {errors.url && touched.url ? (
                    <div className={classes.error}>{errors.url}</div>
                  ) : null}
                </div>
                <div className={classes.formGroup}>
                  <Typography>Method</Typography>
                  <Field
                    as={Select}
                    name="method"
                    className={classes.formField}
                    onChange={(e) => setFieldValue("method", e.target.value)}
                  >
                    <MenuItem value="GET">GET</MenuItem>
                    <MenuItem value="POST">POST</MenuItem>
                    <MenuItem value="PUT">PUT</MenuItem>
                    <MenuItem value="PATCH">PATCH</MenuItem>
                    <MenuItem value="DELETE">DELETE</MenuItem>
                  </Field>
                  {errors.method && touched.method ? (
                    <div className={classes.error}>{errors.method}</div>
                  ) : null}
                </div>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card className="p-4">
                <Typography variant="h6" color="primary" className="my-2">
                  Headers Details
                </Typography>
                <div className={classes.formGroup}>
                  <Typography>Headers</Typography>
                  <FieldArray name="headers">
                    {({ insert, remove, push }) => (
                      <div>
                        {values.headers.length > 0 &&
                          values.headers.map((header, index) => (
                            <div key={index} className="flex items-center mb-2">
                              <TextField
                                size="small"
                                className="w-1/2 mr-2"
                                name={`headers.${index}.key`}
                                placeholder="Key"
                                variant="outlined"
                              />
                              <TextField
                                size="small"
                                className="w-1/2 mr-2"
                                name={`headers.${index}.value`}
                                placeholder="Value"
                                variant="outlined"
                              />
                              <Button
                                type="button"
                                size="small"
                                className="bg-red-500 text-white mx-2 normal-case"
                                color="secondary"
                                variant="contained"
                                onClick={() => remove(index)}
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        <Button
                          type="button"
                          color="primary"
                          size="small"
                          variant="contained"
                          className="bg-blue-500 text-white"
                          onClick={() => push({ key: "", value: "" })}
                        >
                          Add Header
                        </Button>
                      </div>
                    )}
                  </FieldArray>
                </div>
                <div className={classes.formGroup}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="token_required"
                        checked={values.token_required}
                        onChange={(e) => {
                          setFieldValue("token_required", e.target.checked);
                          if (e.target.checked) {
                            setFieldValue("token_config", {
                              token_url: "",
                              token_method: "GET",
                              token_body_type: "json",
                              token_body: "",
                              token_response_path: "",
                              token_expiry_path: "",
                              header_key: "",
                              // additional: [],
                            });
                          } else {
                            setFieldValue("token_config", undefined);
                          }
                        }}
                      />
                    }
                    label="Token Required"
                  />
                </div>
                {values.token_required && (
                  <>
                    <div className={classes.formGroup}>
                      <TextField
                        size="small"
                        className={classes.formField}
                        label="Token URL"
                        name="token_config.token_url"
                        variant="outlined"
                        fullWidth
                      />
                      {errors.token_config?.token_url &&
                      touched.token_config?.token_url ? (
                        <div className={classes.error}>
                          {errors.token_config.token_url}
                        </div>
                      ) : null}
                    </div>

                    <div className={classes.formGroup}>
                      <Typography>Token Method</Typography>
                      <Field
                        as={Select}
                        name="token_config.token_method"
                        className={classes.formField}
                        onChange={(e) => {
                          const method = e.target.value;
                          setFieldValue("token_config.token_method", method);
                          if (method === "GET") {
                            setFieldValue(
                              "token_config.token_body_type",
                              undefined
                            );
                            setFieldValue("token_config.token_body", undefined);
                          }
                        }}
                      >
                        <MenuItem value="GET">GET</MenuItem>
                        <MenuItem value="POST">POST</MenuItem>
                      </Field>
                      {errors.token_config?.token_method &&
                        touched.token_config?.token_method && (
                          <div className={classes.error}>
                            {errors.token_config.token_method}
                          </div>
                        )}
                    </div>

                    {values.token_config.token_method !== "GET" && (
                      <>
                        <div className={classes.formGroup}>
                          <Typography>Token Body Type</Typography>
                          <Field
                            name="token_config.token_body_type"
                            as={Select}
                            className={classes.formField}
                            onChange={(e) => {
                              setFieldValue(
                                "token_config.token_body_type",
                                e.target.value
                              );
                              if (e.target.value === "formData") {
                                setFieldValue("token_config.token_body", [
                                  { key: "", value: "" },
                                ]);
                              } else {
                                setFieldValue("token_config.token_body", "");
                              }
                            }}
                          >
                            <MenuItem value="json">JSON</MenuItem>
                            <MenuItem value="raw">Raw</MenuItem>
                            <MenuItem value="formData">Form Data</MenuItem>
                          </Field>
                          {errors.token_config?.token_body_type &&
                          touched.token_config?.token_body_type ? (
                            <div className={classes.error}>
                              {errors.token_config.token_body_type}
                            </div>
                          ) : null}
                        </div>

                        {values.token_config.token_body_type === "formData" && (
                          <FieldArray name="token_config.token_body">
                            {({ insert, remove, push }) => (
                              <div>
                                {values.token_config.token_body.length > 0 &&
                                  values.token_config.token_body.map(
                                    (body, index) => (
                                      <div
                                        key={index}
                                        className="flex items-center mb-2"
                                      >
                                        <TextField
                                          size="small"
                                          className="w-1/2 mr-2"
                                          variant="outlined"
                                          name={`token_config.token_body.${index}.key`}
                                          placeholder="Key"
                                        />
                                        <TextField
                                          size="small"
                                          className="w-1/2 mr-2"
                                          variant="outlined"
                                          name={`token_config.token_body.${index}.value`}
                                          placeholder="Value"
                                        />
                                        <Button
                                          type="button"
                                          className="bg-red-500 text-white mx-2 normal-case"
                                          color="secondary"
                                          variant="contained"
                                          onClick={() => remove(index)}
                                        >
                                          Remove
                                        </Button>
                                      </div>
                                    )
                                  )}
                                <Button
                                  type="button"
                                  color="primary"
                                  variant="contained"
                                  className="bg-blue-500 text-white"
                                  onClick={() => push({ key: "", value: "" })}
                                >
                                  Add Body Field
                                </Button>
                              </div>
                            )}
                          </FieldArray>
                        )}

                        {["raw", "json"].includes(
                          values.token_config.token_body_type
                        ) && (
                          <div className={classes.formGroup}>
                            <TextField
                              size="small"
                              className={classes.formField}
                              label="Token Body"
                              name="token_config.token_body"
                              variant="outlined"
                              multiline
                              rows={4}
                              fullWidth
                            />
                            {errors.token_config?.token_body &&
                              touched.token_config?.token_body && (
                                <div className={classes.error}>
                                  {errors.token_config.token_body}
                                </div>
                              )}
                          </div>
                        )}
                      </>
                    )}
                    <div className={classes.formGroup}>
                      <TextField
                        size="small"
                        className={classes.formField}
                        label="Token Response Path"
                        name="token_config.token_response_path"
                        variant="outlined"
                        fullWidth
                      />
                      {errors.token_config?.token_response_path &&
                        touched.token_config?.token_response_path && (
                          <div className={classes.error}>
                            {errors.token_config.token_response_path}
                          </div>
                        )}
                    </div>
                  </>
                )}
              </Card>{" "}
            </Grid>

            <Grid item xs={4}>
              <Card className="p-4">
                <Typography variant="h6" color="primary" className="my-2">
                  Request Body Details
                </Typography>
                <div className={classes.formGroup}>
                  <Typography>Request Body</Typography>
                  <Field
                    className={classes.formField}
                    name="request_body_type"
                    as={Select}
                    onChange={(e) => {
                      setFieldValue("request_body_type", e.target.value);
                      if (e.target.value === "formData") {
                        setFieldValue("form_data", [{ key: "", value: "" }]);
                      } else {
                        setFieldValue("form_data", []);
                      }
                    }}
                  >
                    <MenuItem value="json">JSON</MenuItem>
                    <MenuItem value="raw">Raw</MenuItem>
                    <MenuItem value="formData">Form Data</MenuItem>
                  </Field>
                </div>
                {values.request_body_type === "formData" && (
                  <FieldArray name="form_data">
                    {({ insert, remove, push }) => (
                      <div>
                        {values.form_data.length > 0 &&
                          values.form_data.map((data, index) => (
                            <div key={index} className="flex items-center mb-2">
                              <TextField
                                size="small"
                                className="w-1/2 mr-2"
                                variant="outlined"
                                name={`form_data.${index}.key`}
                                placeholder="Key"
                              />
                              <TextField
                                size="small"
                                className="w-1/2 mr-2"
                                variant="outlined"
                                name={`form_data.${index}.value`}
                                placeholder="Value"
                              />
                              <Button
                                type="button"
                                color="secondary"
                                variant="contained"
                                className="bg-red-500 text-white mx-2 normal-case"
                                onClick={() => remove(index)}
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        <Button
                          type="button"
                          color="primary"
                          variant="contained"
                          className="bg-blue-500 text-white"
                        >
                          Add Form Data Field
                        </Button>
                      </div>
                    )}
                  </FieldArray>
                )}
                {["raw", "json"].includes(values.request_body_type) && (
                  <div className={classes.formGroup}>
                    <TextField
                      size="small"
                      className={classes.formField}
                      label="Request Body"
                      name="request_body"
                      as="textarea"
                      variant="outlined"
                      minRows={4}
                      multiline
                    />
                    {errors.request_body && touched.request_body ? (
                      <div className={classes.error}>{errors.request_body}</div>
                    ) : null}
                  </div>
                )}
                <div className={classes.formGroup}>
                  <Typography>Response Config</Typography>
                  <FieldArray name="response_config">
                    {({ insert, remove, push }) => (
                      <div>
                        {values.response_config.length > 0 &&
                          values.response_config.map((response, index) => (
                            <div key={index} className="flex items-center mb-2">
                              <TextField
                                size="small"
                                className="w-1/2 mr-2"
                                name={`response_config.${index}.key`}
                                placeholder="Key"
                                variant="outlined"
                              />
                              <TextField
                                size="small"
                                className="w-1/2 mr-2"
                                name={`response_config.${index}.value`}
                                placeholder="Value"
                                variant="outlined"
                              />
                              <Button
                                type="button"
                                className="bg-red-500 text-white mx-2 normal-case"
                                color="secondary"
                                variant="contained"
                                onClick={() => remove(index)}
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        <Button
                          type="button"
                          color="primary"
                          variant="contained"
                          className="bg-blue-500 text-white"
                          onClick={() => push({ key: "", value: "" })}
                        >
                          Add Response Field
                        </Button>
                      </div>
                    )}
                  </FieldArray>
                </div>
              </Card>
            </Grid>
            <Grid item xs={12} className="flex justify-center">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.button}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default ApiDocumentForm;
