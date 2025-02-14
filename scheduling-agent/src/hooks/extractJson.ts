const extractJson = (message: string) => {
    // Match JSON inside triple backticks (```json ... ```) or normal curly braces {...}
    const jsonMatch = message.match(/```json\s*([\s\S]*?)\s*```|(\{[\s\S]*\})/);
  
    if (jsonMatch) {
      const jsonString = jsonMatch[1] || jsonMatch[2]; // Extract JSON part
  
      try {
        const jsonData = JSON.parse(jsonString.trim()); // Parse extracted JSON
        const cleanedMessage = message.replace(jsonMatch[0], "").trim(); // Remove JSON from original message
  
        return {
          extractedJson: jsonData,
          message: cleanedMessage,
        };
      } catch (error) {
        console.error("Invalid JSON format:", error);
      }
    }
  
    return { extractedJson: null, message };
  };
  
  export default extractJson;
  