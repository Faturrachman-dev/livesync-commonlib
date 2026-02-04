import { describe, it, expect } from "vitest";
import { isDocContentSame } from "./utils";

describe("isDocContentSame", () => {
    it("should return true for identical strings", async () => {
        const content = "Hello, World!";
        const result = await isDocContentSame(content, content);
        expect(result).toBe(true);
    });

    it("should return true for identical ArrayBuffers", async () => {
        const encoder = new TextEncoder();
        const content1 = encoder.encode("Test content").buffer;
        const content2 = encoder.encode("Test content").buffer;
        const result = await isDocContentSame(content1, content2);
        expect(result).toBe(true);
    });

    it("should return false for different content", async () => {
        const content1 = "Hello, World!";
        const content2 = "Goodbye, World!";
        const result = await isDocContentSame(content1, content2);
        expect(result).toBe(false);
    });

    it("should return false for different sizes", async () => {
        const content1 = "Short";
        const content2 = "Much longer content";
        const result = await isDocContentSame(content1, content2);
        expect(result).toBe(false);
    });

    it("should handle large content efficiently (>10KB chunks)", async () => {
        // Create content larger than the 10000 byte checkQuantum
        const largeContent = "x".repeat(25000);
        const encoder = new TextEncoder();
        const content1 = encoder.encode(largeContent).buffer;
        const content2 = encoder.encode(largeContent).buffer;
        
        const startTime = Date.now();
        const result = await isDocContentSame(content1, content2);
        const duration = Date.now() - startTime;
        
        expect(result).toBe(true);
        // Should complete in reasonable time (< 100ms for this size)
        expect(duration).toBeLessThan(100);
    });

    it("should detect differences in large content", async () => {
        const content1 = "x".repeat(25000);
        const content2 = "x".repeat(24999) + "y"; // Different at end
        
        const encoder = new TextEncoder();
        const result = await isDocContentSame(
            encoder.encode(content1).buffer,
            encoder.encode(content2).buffer
        );
        
        expect(result).toBe(false);
    });

    it("should handle Blob inputs", async () => {
        const blob1 = new Blob(["test content"]);
        const blob2 = new Blob(["test content"]);
        const result = await isDocContentSame(blob1, blob2);
        expect(result).toBe(true);
    });

    it("should handle string array inputs", async () => {
        const content1 = ["Hello, ", "World!"];
        const content2 = ["Hello, ", "World!"];
        const result = await isDocContentSame(content1, content2);
        expect(result).toBe(true);
    });
});
