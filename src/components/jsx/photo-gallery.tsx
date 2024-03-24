import { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles
import { ArrowLeft, ArrowRight, XIcon } from 'lucide-react';

type Image = {
    url: string;
    text: string;
};

export const PhotoGallery = ({ images }: { images: Image[] }) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [activeIndex, setActiveIndex] = useState<number>(0);

    const openModal = (index: number) => {
        setActiveIndex(index);
        setIsModalOpen(true);
    };

    useEffect(() => {
        if (isModalOpen) {
            // Disable scroll
            document.body.style.overflow = 'hidden';
        } else {
            // Enable scroll
            document.body.style.overflow = 'auto';
        }

        // Clean up function to reset overflow when component unmounts or modal closes
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isModalOpen]);

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {images.map((photo, index) => (
                    <div key={index} onClick={() => openModal(index)} className="cursor-pointer">
                        <img src={photo.url} alt={photo.text !== '' ? photo.text : `photo${index}`} className="object-cover aspect-square" />
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed top-0 left-0 z-50 bg-black bg-opacity-90 w-full h-full">
                    <div className="p-4 w-full" />
                    <Carousel
                        selectedItem={activeIndex}
                        showArrows={true}
                        showStatus={false}
                        showThumbs={true}
                        showIndicators={false}
                        useKeyboardArrows={true}
                        infiniteLoop={true}
                        onClickItem={() => setIsModalOpen(false)}
                        renderItem={(item) => (
                            <div className="flex justify-center items-center h-full">
                                {item}
                            </div>)}
                        renderThumbs={() => (
                            images.map((image, index) => (
                                <img
                                    key={index}
                                    src={image.url}
                                    alt={image.text || `Thumbnail ${index + 1}`}
                                    className="h-12 object-cover"
                                />
                            ))
                        )}
                        renderArrowNext={(onClickHandler, hasPrev, label) => hasPrev && (
                            <div className="absolute right-0 top-0 z-30 mr-4 h-full flex items-center">
                                <button onClick={onClickHandler} title={label}>
                                    <ArrowRight className="text-white bg-black bg-opacity-50 rounded" />
                                </button>
                            </div>
                        )}
                        renderArrowPrev={(onClickHandler, hasNext, label) => hasNext && (
                            <div className="absolute left-0 top-0 z-30 ml-4 h-full flex items-center">
                                <button onClick={onClickHandler} title={label}>
                                    <ArrowLeft className="text-white bg-black bg-opacity-50 rounded" />
                                </button>
                            </div>
                        )}
                    >
                        {images.map((photo, index) => (
                            <div key={index} className="pt-4">
                                <img src={photo.url} alt={photo.text !== '' ? photo.text : `photo${index}`} className="object-contain max-h-[100vh] md:max-h-[80vh]" />
                            </div>
                        ))}
                    </Carousel>
                    <button onClick={() => setIsModalOpen(false)} className="absolute top-0 right-2 m-4 text-white"><XIcon className='text-white' size={24} /></button>
                </div >
            )}
        </>
    );
};
