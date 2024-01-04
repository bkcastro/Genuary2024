import translate from "translate";
import ISO6391 from 'iso-639-1';

async function translateAndDelay(text, targetLanguage) {
    try {
        const translatedText = await translate(text, { to: targetLanguage });
        console.log(translatedText);
    } catch (error) {
        console.error('Error during translation:', error);
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function loopTranslation(text, languages) {
    for (const language of languages) {
        await translateAndDelay(text, language);
        await delay(4000); // Wait for 4 seconds
    }
}

//var languages = ISO6391.getAllNames()

const textToTranslate = `Once upon a time, 108 rebels gathered on the lakeshore. Their leader, turned to 
the captain, and commanded: "Tell us a story!". So the captain began to tell his story in
 their native language, `
const targetLanguages = ['es', 'fr', 'de', 'it']; // Spanish, French, German, Italian

loopTranslation(textToTranslate, targetLanguages);