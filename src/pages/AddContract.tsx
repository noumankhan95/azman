import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from 'react';
import { FormikProvider, Field, ErrorMessage, useFormik } from 'formik';
import logo from '../images/logo/logo.jpeg';

import * as yup from 'yup';
import DynamicFirebaseImageComponent from '../components/DynamicFirebaseImageComponent';
import ContractComponent from '../components/ContractComponent';
import { LoaderIcon } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
//@ts-ignore
import html2pdf from 'html2pdf.js';
//@ts-ignore
import { db } from '../firebase.js';
import ReactQuill from 'react-quill';
import { addDoc, collection } from 'firebase/firestore';
import useContract from '../store/useContract.js';
type images = {
  url: File | string;
};
const validationSchema = yup.object().shape({
  name: yup.string().required('Name is Required').min(3),
  type: yup.string().required('Type is Required').min(3),
  rentaldetails: yup.array().when('type', {
    is: (type: string) => type === 'Rental',
    then: () =>
      yup.array().of(
        yup.object().shape({
          from: yup.string().required('From is Required'),
          to: yup.string().required('To is Required'),
          price: yup
            .number()
            .min(1, 'Cant be Less than 1')
            .required('Price is Required'),
        }),
      ) as any,
    otherwise: () => yup.array().notRequired(),
  }),
  installmentdetails: yup.array().when('type', {
    is: (type: string) => type === 'Installment',
    then: () =>
      yup.array().of(
        yup.object().shape({
          ninstallments: yup
            .number()
            .min(1)
            .required('No Of Installments are Required'),
          from: yup.string().required('From is Required'),
          to: yup.string().required('To is Required'),
          downpayment: yup
            .number()
            .min(1, 'Cant be Less than 1')
            .required('Downpayment is Required'),
          price: yup
            .number()
            .min(1, 'Cant be Less than 1')
            .required('Price is Required'),
        }),
      ) as any,
    otherwise: () => yup.array().notRequired(),
  }),
  sellingdetails: yup.object().when('type', {
    is: (type: string) => type === 'Selling',
    then: () =>
      yup.object().shape({
        price: yup
          .number()
          .min(0, 'Price Cant be Less Than 0')
          .required('Price is Required'),
      }) as any,
    otherwise: () => yup.object().notRequired(),
  }),
  questions: yup.array().of(
    yup.object().shape({
      question: yup.string().required('Question is Required'),
      answer: yup.string().notRequired(),
    }),
  ),
});

function AddContract() {
  const [isloading, setisloading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { contract, updateIndb, addToDb, isEditing, resetContract } =
    useContract();
  const [images, setimages] = useState<images[]>(contract.file!);
  const [content, setContent] = useState<string>(contract.html);
  const formikObj = useFormik({
    initialValues: {
      name: contract.name || '',
      type: contract.type || '',
      rentaldetails: contract.rentaldetails || [
        {
          from: '',
          to: '',
          price: 0,
        },
      ],
      installmentdetails: contract.installmentdetails || [
        {
          downpayment: 0,
          from: '',
          ninstallments: 0,
          to: '',
          price: 0,
        },
      ],
      sellingdetails: contract.sellingdetails || {
        price: 0,
      },
      questions: contract.questions || [{ question: '', answer: '' }],
    },
    validationSchema,
    async onSubmit(values, formikHelpers) {
      try {
        setisloading(true);
        if (images.length <= 0) {
          toast.error('Add Category Image');
          return;
        }
        if (
          images.some((f) => {
            if (f.url instanceof File && f.url.size > 2 * 1024 * 1024) {
              return true;
            }
            return false;
          })
        ) {
          toast.error('Image Size should be Less than 2MB');

          return;
        }

        if (isEditing.value) {
          await updateIndb({
            file: images,
            html: content,
            name: values.name,
            type: values.type,
            installmentdetails: values.installmentdetails,
            rentaldetails: values.rentaldetails,
            sellingdetails: values.sellingdetails,
            questions: values.questions,
          });
        } else {
          await addToDb({
            file: images,
            html: content,
            name: values.name,
            type: values.type,
            installmentdetails: values.installmentdetails,
            rentaldetails: values.rentaldetails,
            sellingdetails: values.sellingdetails,
            questions: values.questions,
          });
        }
        toast.success('Successfully Added');
        resetContract();
        navigate('/contracts');
      } catch (e) {
        console.log(e);
        return toast.error('An Error Occured ');
      } finally {
        setisloading(false);
      }
    },
  });
  const AddButtonTextToHtml = useCallback((btntext: string) => {
    setContent((c) => c.concat(btntext));
  }, []);
  const contentRef = useRef<any>();
  const maxWords = 1000; // Set your desired maximum number of words
  useEffect(() => {
    formikObj.setValues({
      ...formikObj.values,
      type: contract.type || '', // Set the initial value for type
    });
  }, [contract.type]);
  // Function to strip HTML tags from a string
  const stripHtmlTags = (html: any) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };
  console.log(content);

  const handleChange = (value: any) => {
    const plainTextContent = stripHtmlTags(value);
    // Split the plain text content into words
    const words = plainTextContent.trim().split(/\s+/);
    console.log('aal', words);

    if (words.length > maxWords) {
      // Truncate the content to the maximum number of words
      toast.error('Max Words Reached , Further Text Will Not Be Added');
      // const truncatedContent = words.slice(0, maxWords).join(' ');
      // setContent(truncatedContent);
    } else {
      setContent(value);
    }
  };
  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'], // basic text formatting
    [{ align: [] }], // alignment options
    [{ size: ['small', false, 'large', 'huge'] }],
    [{ header: [1, 2, 3, 4, 5, 6] }], // heading options
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],
    ['clean'],
  ];
  // const handleGetText2 = async () => {
  //   try {
  //     let iframe = document.createElement('iframe');
  //     iframe.style.visibility = 'hidden';
  //     document.body.appendChild(iframe);
  //     let iframedoc = iframe.contentDocument || iframe.contentWindow?.document!;
  //     iframedoc.body.innerHTML = content;

  //     const pageWidth = 595; // A4 width in pixels
  //     const pageHeight = 842; // A4 height in pixels
  //     const margin = 10;

  //     // Calculate the number of pages based on content height
  //     let totalHeight = iframedoc.body.scrollHeight;
  //     let pages = Math.ceil(totalHeight / (pageHeight - margin));

  //     // Create a PDF document
  //     const doc = new jsPDF({
  //       format: 'a4',
  //       unit: 'px',
  //     });

  //     // Loop through each page and add it to the PDF
  //     for (let i = 0; i < pages; i++) {
  //       const startY = i * (pageHeight - margin);
  //       let canvas = await html2canvas(iframedoc.body, {
  //         windowWidth: iframedoc.body.scrollWidth,
  //         windowHeight: iframedoc.body.scrollHeight,
  //         x: 0,
  //         y: startY,
  //         width: pageWidth,
  //         height: pageHeight - margin,
  //       });

  //       // Convert the canvas to an image
  //       let imgData = canvas.toDataURL('image/png');

  //       // Add the image as a page to the PDF
  //       if (i > 0) {
  //         doc.addPage(); // Add a new page for subsequent pages
  //       }
  //       doc.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight, '', 'FAST');
  //     }

  //     // Save the PDF
  //     doc.save('Sample');
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };
  const handleGetText = () => {
    const options = {
      filename: 'my-document.pdf',
      margin: 10, // Adjust the margin to give some space at the edges
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 1 }, // Adjust the scale factor
      jsPDF: {
        unit: 'mm', // Change the unit to millimeters
        format: 'a4',
        orientation: 'portrait',
      },
      pagebreak: { mode: 'avoid-all' },
    };
    html2pdf()
      .set(options)
      .from(contentRef.current.innerHTML)
      .output('dataurlnewwindow', {
        // Output PDF directly with custom margins
        margin: { top: 20, right: 10, bottom: 20, left: 10 }, // Adjust individual margins
      });
  };

  const removeImageFromImages = useCallback((img: string | File) => {
    if (typeof img == 'string') {
      setimages((p) =>
        p.filter((image) => {
          return typeof image.url == 'string' ? image.url !== img : true;
        }),
      );
    } else if (img instanceof File) {
      setimages((p) =>
        p.filter((image) => {
          return image.url instanceof File ? image.url.name !== img.name : true;
        }),
      );
    }
  }, []);
  const MemoizedImages = useMemo(() => {
    return (
      <div className="flex flex-row flex-wrap justify-center items-center py-3">
        {images &&
          images?.map(
            (i, ind) =>
              i.url !== '' && (
                <div className="w-80 my-3 mx-3 md:my-0 relative " key={ind}>
                  {i.url instanceof File ? (
                    <>
                      <svg
                        fill="#ff0000"
                        width="18px"
                        height="18px"
                        viewBox="0 0 32 32"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        stroke="#ff0000"
                        className="cursor-pointer"
                        onClick={() => {
                          removeImageFromImages(i.url);
                        }}
                      >
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          {' '}
                          <title>cancel</title>{' '}
                          <path d="M10.771 8.518c-1.144 0.215-2.83 2.171-2.086 2.915l4.573 4.571-4.573 4.571c-0.915 0.915 1.829 3.656 2.744 2.742l4.573-4.571 4.573 4.571c0.915 0.915 3.658-1.829 2.744-2.742l-4.573-4.571 4.573-4.571c0.915-0.915-1.829-3.656-2.744-2.742l-4.573 4.571-4.573-4.571c-0.173-0.171-0.394-0.223-0.657-0.173v0zM16 1c-8.285 0-15 6.716-15 15s6.715 15 15 15 15-6.716 15-15-6.715-15-15-15zM16 4.75c6.213 0 11.25 5.037 11.25 11.25s-5.037 11.25-11.25 11.25-11.25-5.037-11.25-11.25c0.001-6.213 5.037-11.25 11.25-11.25z"></path>{' '}
                        </g>
                      </svg>
                      {i.url.name.includes('mp4') ||
                      i.url.name.includes('mp3') ? (
                        <video width="320" height="240" controls>
                          <source
                            src={`${URL.createObjectURL(i.url)}`}
                            type="video/mp4"
                          />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <img
                          src={`${URL.createObjectURL(i.url)}`}
                          className="max-w-full object-contain"
                        />
                      )}
                    </>
                  ) : (
                    <DynamicFirebaseImageComponent
                      storagePath={i.url}
                      removeImage={removeImageFromImages}
                    />
                  )}
                </div>
              ),
          )}
      </div>
    );
  }, [images]);
  return (
    <FormikProvider value={formikObj}>
      <div className="flex flex-col gap-5.5 p-6.5">
        <h1>Contract Information</h1>
        <form
          onSubmit={formikObj.handleSubmit}
          className="flex flex-col gap-5.5 p-6.5"
        >
          <div className="flex space-x-4">
            <div className="w-full md:w-2/5">
              <label className="mb-3 block text-black dark:text-white">
                Contract Name
              </label>
              <Field
                type="text"
                name="name"
                placeholder="Name"
                className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-danger"
              />
            </div>
            <div className="w-full md:w-2/5">
              <label className="mb-3 block text-black dark:text-white">
                Contract Type
              </label>
              <Field
                as="select"
                name="type"
                className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              >
                <option>Select</option>
                <option value={'Rental'}>Rental</option>
                <option value={'Selling'}>Selling</option>
                <option value={'Installment'}>Installment</option>
              </Field>
              <ErrorMessage
                name="type"
                component="div"
                className="text-danger"
              />
            </div>
          </div>
          <div className="flex flex-col">
            {formikObj.values.type === 'Rental' &&
              formikObj.values.rentaldetails.map((d, index) => (
                <div
                  className="w-full flex flex-col lg:flex-row lg:space-x-5 my-3 "
                  key={index}
                >
                  <div className="w-full md:w-2/5 ">
                    <label className="mb-3 block text-black dark:text-white">
                      From
                    </label>
                    <Field
                      type="text"
                      name={`rentaldetails.${index}.from`}
                      placeholder="From"
                      className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                    <ErrorMessage
                      name={`rentaldetails.${index}.from`}
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  <div className="w-full md:w-2/5">
                    <label className="mb-3 block text-black dark:text-white">
                      To
                    </label>
                    <Field
                      type="text"
                      name={`rentaldetails.${index}.to`}
                      placeholder="To"
                      className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                    <ErrorMessage
                      name={`rentaldetails.${index}.to`}
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  <div className="w-full md:w-2/5">
                    <label className="mb-3 block text-black dark:text-white">
                      Price
                    </label>
                    <Field
                      type="number"
                      name={`rentaldetails.${index}.price`}
                      className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                    <ErrorMessage
                      name={`rentaldetails.${index}.price`}
                      component="div"
                      className="text-danger"
                    />
                  </div>
                </div>
              ))}
            {formikObj.values.type === 'Installment' &&
              formikObj.values.installmentdetails.map((d, index) => (
                <div
                  className="w-full flex flex-col lg:flex-row lg:space-x-5 my-3 "
                  key={index}
                >
                  <div className="w-full md:w-2/5 ">
                    <label className="mb-3 block text-black dark:text-white">
                      From
                    </label>
                    <Field
                      type="text"
                      name={`installmentdetails.${index}.from`}
                      placeholder="From"
                      className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                    <ErrorMessage
                      name={`installmentdetails.${index}.from`}
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  <div className="w-full md:w-2/5">
                    <label className="mb-3 block text-black dark:text-white">
                      To
                    </label>
                    <Field
                      type="text"
                      name={`installmentdetails.${index}.to`}
                      placeholder="To"
                      className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                    <ErrorMessage
                      name={`installmentdetails.${index}.to`}
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  <div className="w-full md:w-2/5">
                    <label className="mb-3 block text-black dark:text-white">
                      No Of Installments
                    </label>
                    <Field
                      type="number"
                      name={`installmentdetails.${index}.ninstallments`}
                      className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                    <ErrorMessage
                      name={`installmentdetails.${index}.ninstallments`}
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  <div className="w-full md:w-2/5">
                    <label className="mb-3 block text-black dark:text-white">
                      Downpayment
                    </label>
                    <Field
                      type="number"
                      name={`installmentdetails.${index}.downpayment`}
                      placeholder="%"
                      className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                    <ErrorMessage
                      name={`installmentdetails.${index}.downpayment`}
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  <div className="w-full md:w-2/5">
                    <label className="mb-3 block text-black dark:text-white">
                      Price
                    </label>
                    <Field
                      type="number"
                      name={`installmentdetails.${index}.price`}
                      placeholder="Price"
                      className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                    <ErrorMessage
                      name={`installmentdetails.${index}.price`}
                      component="div"
                      className="text-danger"
                    />
                  </div>
                </div>
              ))}
            {formikObj.values.type === 'Selling' && (
              <div className="w-full flex flex-col lg:flex-row lg:space-x-5 my-3 ">
                <div className="w-full md:w-2/5">
                  <label className="mb-3 block text-black dark:text-white">
                    Price
                  </label>
                  <Field
                    type="number"
                    name={`sellingdetails.price`}
                    className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                  <ErrorMessage
                    name={`sellingdetails.price`}
                    component="div"
                    className="text-danger"
                  />
                </div>
              </div>
            )}
          </div>
          {(formikObj.values.type == 'Rental' ||
            formikObj.values.type === 'Installment') && (
            <div className="w-full relative -mt-4">
              <svg
                viewBox="0 0 1024 1024"
                height={30}
                width={30}
                version="1.1"
                className="icon absolute right-0 cursor-pointer"
                xmlns="http://www.w3.org/2000/svg"
                fill="#000000"
                onClick={() => {
                  const type = formikObj.values.type;
                  if (type === 'Rental') {
                    formikObj.setFieldValue('rentaldetails', [
                      ...formikObj.values.rentaldetails,
                      { from: '', to: '', price: 0 },
                    ]);
                  } else if (type === 'Installment') {
                    formikObj.setFieldValue('installmentdetails', [
                      ...formikObj.values.installmentdetails,
                      { from: '', to: '', downpayment: 0, ninstallments: 0 },
                    ]);
                  } else if (type === 'Selling') {
                  }
                }}
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M512 1024C229.7 1024 0 794.3 0 512S229.7 0 512 0s512 229.7 512 512-229.7 512-512 512z m0-938.7C276.7 85.3 85.3 276.7 85.3 512S276.7 938.7 512 938.7 938.7 747.3 938.7 512 747.3 85.3 512 85.3z"
                    fill="#00ff2a"
                  ></path>
                  <path
                    d="M682.7 554.7H341.3c-23.6 0-42.7-19.1-42.7-42.7s19.1-42.7 42.7-42.7h341.3c23.6 0 42.7 19.1 42.7 42.7s-19.1 42.7-42.6 42.7z"
                    fill="#00ff1e"
                  ></path>
                  <path
                    d="M512 725.3c-23.6 0-42.7-19.1-42.7-42.7V341.3c0-23.6 19.1-42.7 42.7-42.7s42.7 19.1 42.7 42.7v341.3c0 23.6-19.1 42.7-42.7 42.7z"
                    fill="#00ff1e"
                  ></path>
                </g>
              </svg>
            </div>
          )}
          <h1>Questions</h1>
          <div className="flex flex-col">
            {formikObj.values.questions?.map((d, index) => (
              <div
                className="w-full flex flex-col lg:flex-row lg:space-x-5 my-3 "
                key={index}
              >
                <div className="w-full md:w-2/5 ">
                  <label className="mb-3 block text-black dark:text-white">
                    Question {index+1}
                  </label>
                  <Field
                    type="text"
                    name={`questions.${index}.question`}
                    placeholder="question"
                    className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                  <ErrorMessage
                    name={`questions.${index}.question`}
                    component="div"
                    className="text-danger"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="w-full relative -mt-4  lg:right-203">
            <svg
              viewBox="0 0 1024 1024"
              height={30}
              width={30}
              version="1.1"
              className="icon absolute right-0 cursor-pointer"
              xmlns="http://www.w3.org/2000/svg"
              fill="#000000"
              onClick={() => {
                formikObj.setFieldValue('questions', [
                  ...formikObj.values.questions,
                  { question: '', answer: '' },
                ]);
              }}
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M512 1024C229.7 1024 0 794.3 0 512S229.7 0 512 0s512 229.7 512 512-229.7 512-512 512z m0-938.7C276.7 85.3 85.3 276.7 85.3 512S276.7 938.7 512 938.7 938.7 747.3 938.7 512 747.3 85.3 512 85.3z"
                  fill="#00ff2a"
                ></path>
                <path
                  d="M682.7 554.7H341.3c-23.6 0-42.7-19.1-42.7-42.7s19.1-42.7 42.7-42.7h341.3c23.6 0 42.7 19.1 42.7 42.7s-19.1 42.7-42.6 42.7z"
                  fill="#00ff1e"
                ></path>
                <path
                  d="M512 725.3c-23.6 0-42.7-19.1-42.7-42.7V341.3c0-23.6 19.1-42.7 42.7-42.7s42.7 19.1 42.7 42.7v341.3c0 23.6-19.1 42.7-42.7 42.7z"
                  fill="#00ff1e"
                ></path>
              </g>
            </svg>
          </div>
          <div className="overflow-hidden rounded-sm border border-strokeshadow-default dark:border-strokedark my-5 dark:bg-boxdark">
            <div className="px-4 py-5 pb-6 text-center lg:pb-8 xl:pb-11.5">
              <h1>Choose Image</h1>
              <div className="relative z-30 mx-auto  h-30 w-full max-w-30 rounded-full p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
                <div className="relative drop-shadow-2">
                  <svg
                    viewBox="0 0 1024 1024"
                    className="icon"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#000000"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <path
                        d="M853.333333 960H170.666667V64h469.333333l213.333333 213.333333z"
                        fill="#90CAF9"
                      ></path>
                      <path
                        d="M821.333333 298.666667H618.666667V96z"
                        fill="#E1F5FE"
                      ></path>
                      <path
                        d="M448 490.666667l-149.333333 213.333333h298.666666z"
                        fill="#1565C0"
                      ></path>
                      <path
                        d="M597.333333 563.2L490.666667 704h213.333333z"
                        fill="#1976D2"
                      ></path>
                      <path
                        d="M672 522.666667m-32 0a32 32 0 1 0 64 0 32 32 0 1 0-64 0Z"
                        fill="#1976D2"
                      ></path>
                    </g>
                  </svg>
                  <label
                    htmlFor="file"
                    className="absolute bottom-0 right-0 flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2"
                  >
                    <svg
                      className="fill-current"
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M4.76464 1.42638C4.87283 1.2641 5.05496 1.16663 5.25 1.16663H8.75C8.94504 1.16663 9.12717 1.2641 9.23536 1.42638L10.2289 2.91663H12.25C12.7141 2.91663 13.1592 3.101 13.4874 3.42919C13.8156 3.75738 14 4.2025 14 4.66663V11.0833C14 11.5474 13.8156 11.9925 13.4874 12.3207C13.1592 12.6489 12.7141 12.8333 12.25 12.8333H1.75C1.28587 12.8333 0.840752 12.6489 0.512563 12.3207C0.184375 11.9925 0 11.5474 0 11.0833V4.66663C0 4.2025 0.184374 3.75738 0.512563 3.42919C0.840752 3.101 1.28587 2.91663 1.75 2.91663H3.77114L4.76464 1.42638ZM5.56219 2.33329L4.5687 3.82353C4.46051 3.98582 4.27837 4.08329 4.08333 4.08329H1.75C1.59529 4.08329 1.44692 4.14475 1.33752 4.25415C1.22812 4.36354 1.16667 4.51192 1.16667 4.66663V11.0833C1.16667 11.238 1.22812 11.3864 1.33752 11.4958C1.44692 11.6052 1.59529 11.6666 1.75 11.6666H12.25C12.4047 11.6666 12.5531 11.6052 12.6625 11.4958C12.7719 11.3864 12.8333 11.238 12.8333 11.0833V4.66663C12.8333 4.51192 12.7719 4.36354 12.6625 4.25415C12.5531 4.14475 12.4047 4.08329 12.25 4.08329H9.91667C9.72163 4.08329 9.53949 3.98582 9.4313 3.82353L8.43781 2.33329H5.56219Z"
                        fill=""
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M7.00004 5.83329C6.03354 5.83329 5.25004 6.61679 5.25004 7.58329C5.25004 8.54979 6.03354 9.33329 7.00004 9.33329C7.96654 9.33329 8.75004 8.54979 8.75004 7.58329C8.75004 6.61679 7.96654 5.83329 7.00004 5.83329ZM4.08337 7.58329C4.08337 5.97246 5.38921 4.66663 7.00004 4.66663C8.61087 4.66663 9.91671 5.97246 9.91671 7.58329C9.91671 9.19412 8.61087 10.5 7.00004 10.5C5.38921 10.5 4.08337 9.19412 4.08337 7.58329Z"
                        fill=""
                      />
                    </svg>
                    <input
                      type="file"
                      name="file"
                      id="file"
                      value=""
                      className="sr-only"
                      onChange={(e: any) => {
                        setimages((p) => [{ url: e.target.files?.[0]! }]);
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
            <>{MemoizedImages}</>
          </div>
          <>
            <div>
              <div>
                <ReactQuill
                  theme="snow" // or 'bubble' for a different theme
                  value={content}
                  onChange={handleChange}
                  className="h-100 mb-20"
                  modules={{ toolbar: toolbarOptions }}
                />
                <button
                  className="px-4 py-2 bg-meta-1 rounded-md mx-2 text-white"
                  type="button"
                  onClick={AddButtonTextToHtml.bind(null, '{{first_name}}')}
                >
                  Add First Name
                </button>
                <button
                  className="px-4 py-2 bg-meta-1 rounded-md mx-2 text-white"
                  type="button"
                  onClick={AddButtonTextToHtml.bind(null, '{{last_name}}')}
                >
                  Add Last Name
                </button>
              </div>

              <h3 className="text-2xl dark:text-white my-10">Preview</h3>

              <div className="border-2 border-solid border-dark dark:border-white px-4 py-3">
                <section ref={contentRef}>
                  {/* <div className="flex items-center">
                    <img src={logo} className="h-40 w-52 object-contain" />
                    <h2 className="text-6xl font-semibold ">Azman</h2>
                  </div> */}
                  <div
                    className="ql-editor"
                    id="div-tToPrint"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                </section>
              </div>

              <button onClick={handleGetText} className="underline my-10">
                Download
              </button>
            </div>
          </>
          <button
            className="w-52 rounded bg-primary p-3 font-medium text-gray"
            type="submit"
          >
            {isloading ? (
              <LoaderIcon style={{ height: 30, width: 30, margin: 'auto' }} />
            ) : isEditing.value ? (
              'Update'
            ) : (
              'Save'
            )}
          </button>
        </form>
      </div>
    </FormikProvider>
  );
}

export default AddContract;
