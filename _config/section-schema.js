import { z } from "zod";
import { fromZodError } from "zod-validation-error";

// Section types this template knows about. Each maps 1:1 to a partial in
// _includes/sections/<type>.njk and a stylesheet in css/sections/<type>.css.
export const SECTION_TYPES = [
	"hero",
	"services",
	"process",
	"testimonials",
	"faq",
	"contact",
];

// Registered as the eleventyDataSchema key in
// content/sections/sections.11tydata.js. Fails the build with a readable
// message on an unknown section type or missing required front matter.
export function validateSection(data) {
	const requireArray = (ctx, field) => {
		if (!Array.isArray(data[field]) || data[field].length === 0) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: [field],
				message: `is required (non-empty array) when type is "${data.type}"`,
			});
		}
	};

	const result = z
		.object({
			title: z.string(),
			type: z.enum(SECTION_TYPES),
			order: z.number().int().min(0).optional(),
		})
		.passthrough()
		.superRefine((value, ctx) => {
			if (value.type === "services") requireArray(ctx, "services");
			if (value.type === "process") requireArray(ctx, "steps");
			if (value.type === "testimonials") requireArray(ctx, "quotes");
			if (value.type === "faq") requireArray(ctx, "items");
			if (value.type === "contact" && typeof value.email !== "string") {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					path: ["email"],
					message: 'is required when type is "contact"',
				});
			}
		})
		.safeParse(data);

	if (result.error) {
		const where = this?.page?.inputPath ? `${this.page.inputPath}: ` : "";
		throw new Error(
			`Invalid section front matter: ${where}${fromZodError(result.error).message}`,
		);
	}
}
