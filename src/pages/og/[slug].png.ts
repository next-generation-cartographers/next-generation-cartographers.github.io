import { NodeCompiler } from "@myriaddreamin/typst-ts-node-compiler";
import { getCollection, getEntries } from "astro:content";
import sharp from "sharp";

export async function getStaticPaths() {
  const tutorials = await getCollection("tutorials");
  const paths = tutorials.map((p) => ({ params: { slug: p.id } }));
  return paths;
}

export async function GET({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const tutorials = await getCollection("tutorials");
  const tutorial = tutorials.find((p) => p.id === slug);
  if (!tutorial) return new Response("Not found", { status: 404 });
  const authors = await getEntries(tutorial.data.authors);

  // prepare Typst template + inputs (simple example)
  const typstTemplate = `
    #import "@preview/cetz:0.4.2"

    #let data = json(bytes(sys.inputs.data)).data

    #let page-width = 120pt
    #let page-height = 63pt

    #set text(fill: white)

    #set page(
      fill: rgb(0, 100, 255),
      width: page-width,
      height: page-height,
      margin: page-width * 0.1,
      background: cetz.canvas(length: 1pt, {
        import cetz.draw: *
        range(0, 20)
          .map(i => line(
            (i * 10, 0),
            (i * 10 + 70, -70),
            stroke: i * .3pt + rgb(20, 120, 255),
          ))
          .join()
      }),
      header: text(
        font: "Source Sans 3",
        weight: 800,
        size: page-height * 0.05,
      )[#data.authors.join(", ", last: text(weight: 400)[ and ])],
    )
    #set align(bottom)
    #show heading: set text(size: page-height * 0.15, font: "Space Grotesk", weight: 100)
    #show heading: set par(leading: 0.3em)

    = #data.title
  `;
  const inputs = {
    data: {
      title: tutorial.data.title,
      authors: authors.map((a) => a.data.name),
    },
  };

  const compiler = NodeCompiler.create({
    fontArgs: [{ fontPaths: ["./public/fonts/"] }],
  });

  // compile to SVG
  const svgResult = compiler.svg({
    mainFileContent: typstTemplate,
    inputs: { data: JSON.stringify(inputs) },
  });

  // convert SVG -> JPEG
  const pngBuffer = await sharp(Buffer.from(svgResult, "utf8"))
    .resize(1200, 630, { fit: "contain" })
    .png()
    .toBuffer();

  const body = Uint8Array.from(pngBuffer);
  return new Response(body, { headers: { "Content-Type": "image/png" } });
}
