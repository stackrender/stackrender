
const NotFoundPage : React.FC = ({}) => { 
    return(
        <section >
            <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
                <div className="mx-auto max-w-screen-sm text-center">
                    <h1 className="mb-4 text-7xl font-extrabold  text-primary lg:text-9xl">
                        404
                    </h1>
                    <p className="mb-4 text-3xl font-bold md:text-4xl text-font/90">
                        Something's missing.
                    </p>
                    <p className="mb-4 text-lg font-light text-font/70">
                        Sorry, we can't find that page. You'll find lots to
                        explore on the home page.
                    </p>
                </div>
            </div>
        </section>
    )
} 


export default NotFoundPage ; 