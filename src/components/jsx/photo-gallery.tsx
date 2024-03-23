export const PhotoGallery = ({ images }: { images: { url: string; text: string }[] }) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {images.map((photo, index) => (
                <div key={index} className="aspect-w-1 aspect-h-1">
                    <img src={photo.url} alt={photo.text != '' ? photo.text : 'photo' + index} className="object-fit h-full w-60" />
                </div>
            ))}
        </div>
    );
};


