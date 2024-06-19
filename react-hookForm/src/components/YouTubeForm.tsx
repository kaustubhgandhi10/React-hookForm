import { useForm, useFieldArray, FieldErrors } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { useEffect } from "react";

type FormValues = {
  username: string;
  email: string;
  channel: string;
  phoneNumbers: string[];
  phNumbers: {
    number: string;
  }[];
  age: number;
  dob: Date;
};

let renderCount = 0;

export const YouTubeForm = () => {
  const form = useForm<FormValues>({
    defaultValues: async () => {
      const res = await fetch("https://jsonplaceholder.typicode.com/users/1");
      const data = await res.json();
      return {
        username: "Batman",
        email: data.email,
        channel: "",
        phoneNumbers: ["", ""],
        phNumbers: [{ number: "" }],
        age: 0,
        dob: new Date(),
      };
    },
  });
  const { register, control, handleSubmit, formState, reset } = form;
  const { errors, isSubmitSuccessful } = formState;

  console.log({ isSubmitSuccessful });

  const { fields, append, remove } = useFieldArray({
    name: "phNumbers",
    control,
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form Submitted", data);
  };

  const onerror = (errors: FieldErrors<FormValues>) => {
    console.log("Form errors", errors);
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  renderCount++;
  return (
    <div>
      <h1>YouTube Form({renderCount / 2})</h1>
      <form onSubmit={handleSubmit(onSubmit, onerror)} noValidate>
        <div className="form-control">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id=" username"
            {...register("username", {
              required: "Username is required",
            })}
          />

          <p className="error">{errors.username?.message}</p>
        </div>
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email "
            {...register("email", {
              pattern: {
                value:
                  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                message: "Invalid email format",
              },
            })}
          />

          <p className="error">{errors.email?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="channel">Channel</label>
          <input
            type="text"
            id="channel "
            {...register("channel", {
              required: "Channel is required",
            })}
          />

          <p className="error">{errors.channel?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="primary-phone">Primary phone number</label>
          <input
            type="number"
            id="primary-phone "
            {...register("phoneNumbers.0", {
              required: "primary-phone is required",
            })}
          />
        </div>

        <div className="form-control">
          <label htmlFor="secondary-phone">Secondary phone number</label>
          <input
            type="number"
            id="secondary-phone "
            {...register("phoneNumbers.1", {
              required: "secondary-phone is required",
            })}
          />
        </div>
        <div>
          <label htmlFor="">List of phone numbers</label>
          <div>
            {fields.map((field, index) => {
              return (
                <div className="form-control" key={field.id}>
                  <input
                    type="text"
                    {...register(`phNumbers.${index}.number` as const)}
                  />
                  {index > 0 && (
                    <button type="button" onClick={() => remove(index)}>
                      Remove
                    </button>
                  )}
                </div>
              );
            })}
            <button type="button" onClick={() => append({ number: "" })}>
              Add phone number
            </button>
          </div>
        </div>

        <div className="form-control">
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age "
            {...register("age", {
              valueAsNumber: true,
              required: {
                value: true,
                message: "Age is required",
              },
            })}
          />

          <p className="error">{errors.age?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="dob">Date of birth</label>
          <input
            type="date"
            id="dob "
            {...register("dob", {
              valueAsDate: true,
              required: {
                value: true,
                message: "Date of birth is required",
              },
            })}
          />

          <p className="error">{errors.dob?.message}</p>
        </div>

        <button>Submit</button>
        <button type="button" onClick={() => reset()}>
          Reset
        </button>
      </form>
      <DevTool control={control} />
    </div>
  );
};
