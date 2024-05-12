import fetch from 'node-fetch';
import cheerio from 'cheerio';

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
    try {
        // Check if the input text is empty
        if (!text || text.trim().length === 0) {
            return m.reply("Input URL");
        }

        // Check if the URL starts with 'http://' or 'https://'
        if (!text.startsWith('http://') && !text.startsWith('https://') && !text.startsWith('m')) {
            return m.reply("Invalid URL");
        }

        // Function to remove "https://" or "http://" if they exist, and remove "m" if it exists
        function removeHttp(url) {
            return url.replace(/^(https?:\/\/|m)/, '');
        }

        // Function to check the URL
        async function checkUrl(url) {
            try {
                const searchTerm = removeHttp(url);
                const searchUrl = "https://www.urlvoid.com/scan/" + searchTerm;

                const response = await fetch(searchUrl);
                const body = await response.text();
                const $ = cheerio.load(body);

                // Extracting website address
                const websiteAddress = $('table.table-custom.table-striped tbody tr:nth-child(1) td:nth-child(2) strong').text().trim();
                // Extracting last analysis
                const lastAnalysis = $('span.font-bold:contains("Last Analysis")').parent().next().text().trim();
                // Extracting detections counts
                const detectionsCounts = $('span.font-bold:contains("Detections Counts")').parent().next().text().trim();
                // Extracting domain registration
                const domainRegistration = $('span.font-bold:contains("Domain Registration")').parent().next().text().trim();
                // Extracting IP Address
                const ipAddress = $('span.font-bold:contains("IP Address")').parent().next().find('strong').text().trim();
                // Extracting Reverse DNS
                const reverseDNS = $('span.font-bold:contains("Reverse DNS")').parent().next().text().trim();
                // Extracting ASN
                const asn = $('span.font-bold:contains("ASN")').parent().next().text().trim();
                // Extracting Server Location
                const serverLocation = $('span.font-bold:contains("Server Location")').parent().next().text().trim();
                // Extracting Latitude\Longitude
                const latitudeLongitude = $('span.font-bold:contains("Latitude\\Longitude")').parent().next().text().trim();
                // Extracting City
                const city = $('span.font-bold:contains("City")').parent().next().text().trim();
                // Extracting Region
                const region = $('span.font-bold:contains("Region")').parent().next().text().trim();

                // Constructing the reply message
                const replyMessage = `
Website Address: ${websiteAddress}
Last Analysis: ${lastAnalysis}
Detections Counts: ${detectionsCounts}
Domain Registration: ${domainRegistration}
IP Address: ${ipAddress}
Reverse DNS: ${reverseDNS}
ASN: ${asn}
Server Location: ${serverLocation}
Latitude\Longitude: ${latitudeLongitude}
City: ${city}
Region: ${region}
`;

                return replyMessage;
            } catch (error) {
                console.error("Error accessing data:", error);
                return "Error accessing data. Please try again later.";
            }
        }

        // Checking the URL and sending the reply
        const reply = await checkUrl(text);
        await m.reply(reply);
    } catch (error) {
        console.error("Error:", error);
    }
};

handler.command = /^(checksite)$/i;
export default handler;